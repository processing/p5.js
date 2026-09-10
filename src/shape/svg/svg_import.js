import { ShapeRecorder, ShapeNode, TransformStack } from "./svg_recorder.js";

// Map of standard SVG path commands (moveto, lineto, curveto, arcto, closepath) and their expected parameter signatures.
// These definitions are used by the SVG importer to parse path strings into p5 shape drawing operations.
const PATH_COMMANDS = Object.freeze({
    M: { args: ["x", "y"], implicit: "L" },
    m: { args: ["dx", "dy"], implicit: "l" },
    L: { args: ["x", "y"], implicit: "L" },
    l: { args: ["dx", "dy"], implicit: "l" },
    H: { args: ["x"], implicit: "H" },
    h: { args: ["dx"], implicit: "h" },
    V: { args: ["y"], implicit: "V" },
    v: { args: ["dy"], implicit: "v" },
    C: { args: ["x1", "y1", "x2", "y2", "x", "y"], implicit: "C" },
    c: { args: ["dx1", "dy1", "dx2", "dy2", "dx", "dy"], implicit: "c" },
    S: { args: ["x2", "y2", "x", "y"], implicit: "S" },
    s: { args: ["dx2", "dy2", "dx", "dy"], implicit: "s" },
    Q: { args: ["x1", "y1", "x", "y"], implicit: "Q" },
    q: { args: ["dx1", "dy1", "dx", "dy"], implicit: "q" },
    T: { args: ["x", "y"], implicit: "T" },
    t: { args: ["dx", "dy"], implicit: "t" },
    A: { args: ["rx", "ry", "rotation", "largeArc", "sweep", "x", "y"], implicit: "A" },
    a: { args: ["rx", "ry", "rotation", "largeArc", "sweep", "dx", "dy"], implicit: "a" },
    Z: { args: [], implicit: "Z" },
    z: { args: [], implicit: "z" }
});

const warnedFeatures = new Set();
function warnOnce(message) {
    if (!warnedFeatures.has(message)) {
        warnedFeatures.add(message);
        console.warn(message);
    }
}

// TransformResolver parses SVG transform attribute lists (translate, rotate, scale, matrix)
// and multiplies them into the current TransformStack DOMMatrix during SVG element imports.
class TransformResolver {
    apply(node, transformStack) {
        if (!node.transform?.baseVal) {
            return;
        }

        const transforms = node.transform.baseVal;

        for (let i = 0; i < transforms.numberOfItems; i++) {
            const matrix = transforms.getItem(i).matrix;

            transformStack.current.multiplySelf(
                new DOMMatrix([
                    matrix.a,
                    matrix.b,
                    matrix.c,
                    matrix.d,
                    matrix.e,
                    matrix.f,
                ])
            );
        }
    }
}

// StyleResolver cascades CSS properties, presentation attributes, fill rules, stroke weights,
// opacities, and display/visibility styles down the SVG DOM tree.
class StyleResolver {
    resolveNodeStyle(node, parentContext) {
        const context = parentContext.clone();
        const styleAttr = node.getAttribute("style");
        const inlineStyle = styleAttr ? this.parseInlineStyle(styleAttr) : null;

        this.resolveColor(context, node, inlineStyle);
        this.resolveFill(context, node, inlineStyle);
        this.resolveStroke(context, node, inlineStyle, parentContext);
        this.resolveOpacity(context, node, inlineStyle, parentContext);
        this.resolveDisplayAndVisibility(context, node, inlineStyle, parentContext);

        return context;
    }

    resolveColor(context, node, inlineStyle) {
        const rawColor = this.getProp(node, inlineStyle, "color");
        if (rawColor !== undefined && rawColor.trim().toLowerCase() !== "currentcolor") {
            context.color = rawColor;
        }
    }

    resolveDisplayAndVisibility(context, node, inlineStyle, parentContext) {
        const rawDisplay = this.getProp(node, inlineStyle, "display");
        if (parentContext.display === "none") {
            context.display = "none";
        } else if (rawDisplay !== undefined) {
            context.display = rawDisplay;
        } else {
            context.display = "inline";
        }

        const rawVisibility = this.getProp(node, inlineStyle, "visibility");
        if (rawVisibility !== undefined) {
            context.visibility = rawVisibility;
        }
    }

    resolveOpacity(context, node, inlineStyle, parentContext) {
        const rawOpacity = this.getProp(node, inlineStyle, "opacity");
        if (rawOpacity !== undefined) {
            const val = parseOpacityValue(rawOpacity);
            if (!isNaN(val)) {
                context.opacity = parentContext.opacity * val;
            }
        }
        const rawFillOpacity = this.getProp(node, inlineStyle, "fill-opacity", "fillOpacity");
        if (rawFillOpacity !== undefined) {
            const val = parseOpacityValue(rawFillOpacity);
            if (!isNaN(val)) {
                context.fillOpacity = val;
            }
        }
        const rawStrokeOpacity = this.getProp(node, inlineStyle, "stroke-opacity", "strokeOpacity");
        if (rawStrokeOpacity !== undefined) {
            const val = parseOpacityValue(rawStrokeOpacity);
            if (!isNaN(val)) {
                context.strokeOpacity = val;
            }
        }
    }

    resolveStroke(context, node, inlineStyle, parentContext) {
        const rawStroke = this.getProp(node, inlineStyle, "stroke");
        if (rawStroke !== undefined) {
            context.stroke = rawStroke;
        }
        const rawStrokeWidth = this.getProp(node, inlineStyle, "stroke-width", "strokeWidth");
        if (rawStrokeWidth !== undefined) {
            context.strokeWidth = parseLength(rawStrokeWidth, parentContext.strokeWidth);
        }
        const rawStrokeCap = this.getProp(node, inlineStyle, "stroke-linecap","strokeLinecap");

        if (rawStrokeCap !== undefined) {
            context.strokeCap = rawStrokeCap;
        }
    }

    resolveFill(context, node, inlineStyle) {
        const rawFill = this.getProp(node, inlineStyle, "fill");
        if (rawFill !== undefined) {
            context.fill = rawFill;
        }
    }

    getProp(node, inlineStyle, kebabName, camelName) {
        let val;

        if (inlineStyle) {
            val = inlineStyle[kebabName];
            if (val !== undefined && val !== "inherit") {
                return val;
            }
        }

        if (this.styleCache) {
            const cached = this.styleCache.get(node);
            if (cached) {
                val = cached[kebabName];
                if (val !== undefined && val !== "inherit" && val !== "") {
                    return val;
                }
            }
        }

        val = node.getAttribute(kebabName);
        if (val !== null && val !== "inherit") {
            return val;
        }
        if (camelName) {
            val = node.getAttribute(camelName);
            if (val !== null && val !== "inherit") {
                return val;
            }
        }
        return undefined;
    }

    parseInlineStyle(styleStr) {
        const styles = {};
        if (!styleStr) return styles;
        const decls = styleStr.split(";");
        for (const decl of decls) {
            const colonIndex = decl.indexOf(":");
            if (colonIndex === -1) continue;
            const prop = decl.slice(0, colonIndex).trim().toLowerCase();
            const val = decl.slice(colonIndex + 1).trim();
            if (prop && val) {
                styles[prop] = val;
            }
        }
        return styles;
    }

    preprocess(svgRoot) {
        this.styleCache = new WeakMap();

        const styleEls = svgRoot.querySelectorAll("style");
        const allRules = [];

        for (const styleEl of styleEls) {
            // Retrieve stylesheet via native CSSOM
            const sheet = styleEl.sheet;
            if (!sheet) {
                console.warn("SVG Importer Warning: CSS stylesheet could not be parsed via CSSOM (styleEl.sheet is null).");
                continue;
            }

            let rulesList;
            try {
                rulesList = sheet.cssRules;
            } catch (e) {
                console.warn("SVG Importer Warning: Failed to access cssRules from stylesheet.", e);
                continue;
            }

            for (let i = 0; i < rulesList.length; i++) {
                const rule = rulesList[i];

                if (rule.type !== CSSRule.STYLE_RULE) {
                    console.warn(`SVG Importer Warning: Skipping non-style rule type ${rule.type} (${rule.cssText})`);
                    continue;
                }

                const decl = rule.style;
                const styles = {};
                for (let j = 0; j < decl.length; j++) {
                    const prop = decl[j];
                    styles[prop] = decl.getPropertyValue(prop).trim();
                }

                if (Object.keys(styles).length > 0) {
                    const rawSelectors = rule.selectorText;
                    if (rawSelectors) {
                        const selectorList = rawSelectors.split(",");
                        for (const sel of selectorList) {
                            const selectorText = sel.trim();
                            if (selectorText) {
                                allRules.push({
                                    selectorText,
                                    styles,
                                    specificity: this.getSpecificity(selectorText)
                                });
                            }
                        }
                    }
                }
            }
        }
        allRules.sort((a, b) => a.specificity - b.specificity);

        for (const rule of allRules) {
            if (!this._isSupportedSelector(rule.selectorText)) continue;

            let matched;
            try {
                matched = svgRoot.querySelectorAll(rule.selectorText);
            } catch (err) {
                continue;
            }

            for (const el of matched) {
                if (!this.styleCache.has(el)) {
                    this.styleCache.set(el, {});
                }
                const cached = this.styleCache.get(el);
                for (const [prop, val] of Object.entries(rule.styles)) {
                    cached[prop] = val;
                }
            }
        }
    }

    getSpecificity(selector) {
        let a = 0, b = 0, c = 0;
        const tokens = selector.split(/[\s>+~]+/);
        for (const token of tokens) {
            if (!token) continue;
            const ids = token.match(/#[a-zA-Z0-9_-]+/g);
            if (ids) a += ids.length;
            const classes = token.match(/\.[a-zA-Z0-9_-]+/g);
            if (classes) b += classes.length;
            const attrs = token.match(/\[[^\]]+\]/g);
            if (attrs) b += attrs.length;
            const cleanToken = token.replace(/#[a-zA-Z0-9_-]+/g, "")
                                   .replace(/\.[a-zA-Z0-9_-]+/g, "")
                                   .replace(/\[[^\]]+\]/g, "");
            if (cleanToken && /^[a-zA-Z]/.test(cleanToken)) {
                c += 1;
            }
        }
        return a * 100 + b * 10 + c;
    }

    _isSupportedSelector(selectorText) {
        return selectorText.split(",").every(part => !part.includes(":"));
    }
}

class RenderContext {
    constructor(parent) {
        if (parent) {
            this.fill = parent.fill;
            this.stroke = parent.stroke;
            this.strokeWidth = parent.strokeWidth;
            this.strokeCap = parent.strokeCap;
            this.opacity = parent.opacity;
            this.fillOpacity = parent.fillOpacity;
            this.strokeOpacity = parent.strokeOpacity;
            this.visibility = parent.visibility;
            this.display = parent.display === "none" ? "none" : "inline";
            this.color = parent.color;
        } else {
            this.fill = "rgb(0, 0, 0)";
            this.stroke = "none";
            this.strokeWidth = 1;
            this.strokeCap = "butt";
            this.opacity = 1;
            this.fillOpacity = 1;
            this.strokeOpacity = 1;
            this.visibility = "visible";
            this.display = "inline";
            this.color = "rgb(0, 0, 0)";
            //todo future properties like blendMode, etc.
        }
    }
    clone() {
        return new RenderContext(this);
    }
}


// Parses opacity strings (supporting percentages) and clamps them to [0, 1]
function parseOpacityValue(raw) {
    if (raw === undefined || raw === null || raw === "") return NaN;
    const str = String(raw).trim();
    let val = parseFloat(str);
    if (isNaN(val)) return NaN;
    if (str.endsWith("%")) {
        val = val / 100;
    }
    return Math.max(0, Math.min(1, val));
}

function parseLength(val, defaultValue) {
    if (val === undefined || val === null || val === "") return defaultValue;
    const str = String(val).trim();
    const num = parseFloat(str);
    if (isNaN(num)) return defaultValue;
    return num; // Simplified - just return the number
}

function resolvePairedRadii(rx, ry) {
    const hasValidRx = rx !== null && rx !== undefined && !isNaN(rx) && rx >= 0;
    const hasValidRy = ry !== null && ry !== undefined && !isNaN(ry) && ry >= 0;

    let resolvedRx = rx;
    let resolvedRy = ry;

    if (!hasValidRx && !hasValidRy) {
        resolvedRx = 0;
        resolvedRy = 0;
    } else if (hasValidRx && !hasValidRy) {
        resolvedRy = resolvedRx;
    } else if (!hasValidRx && hasValidRy) {
        resolvedRx = resolvedRy;
    }
    return { rx: resolvedRx, ry: resolvedRy };
}

export function SVGImportAddon(p5, fn, lifecycles) {
    class ShapeBuilder {
        constructor(pInst, recorder, transformStack) {
            this.p5 = pInst;
            this.recorder = recorder;
            this.transformStack = transformStack;
        }

        makeColor(colorStr, opacity, context) {
            if (colorStr && colorStr.startsWith("url(")) {
                warnOnce("SVG Importer Warning: Gradients and patterns (url(...)) are not supported yet.");
                return null;
            }
            if (!colorStr || colorStr === "none") {
                return null;
            }
            let parsedColor = colorStr.trim();
            if (parsedColor.toLowerCase() === "currentcolor") {
                parsedColor = context.color || "rgb(0, 0, 0)";
                if (parsedColor.toLowerCase() === "currentcolor") {
                    parsedColor = "rgb(0, 0, 0)";
                }
            }
            try {
                // Parse color first
                const c = this.p5.color(parsedColor);
                // Convert to a standardized RGBA string using documented public API to resolve HSL/HSB to RGB coords
                const rgbStr = c.toString('rgba');
                const rgbColor = this.p5.color(rgbStr);
                // Set alpha using public API on the RGB-mode color to avoid p5 HSL alpha-scaling bugs
                rgbColor.setAlpha(this.p5.alpha(rgbColor) * opacity);

                return rgbColor;
            } catch (e) {
                warnOnce(`SVG Importer Warning: Failed to parse color: "${colorStr}"`);
                return null;
            }
        }

        captureState(context) {
            return {
                transform: new DOMMatrix(this.transformStack.current),
                fill: this.makeColor(context.fill, context.opacity * context.fillOpacity, context),
                stroke: this.makeColor(context.stroke, context.opacity * context.strokeOpacity, context),
                strokeWeight: context.strokeWidth,
                strokeCap: context.strokeCap,
                renderContext: context.clone(),
                fillOpacity: context.fillOpacity,
                strokeOpacity: context.strokeOpacity,
            };
        }

        createShape(builder) {
            const shape = new p5.Shape({
                position: new p5.Vector(0, 0)
            });
            shape.beginShape();
            builder(shape);
            shape.endShape();
            return shape;
        }

        addPrimitive(context, builder) {
            if (context.visibility === "hidden" || context.visibility === "collapse") {
                return;
            }
            const shape = this.createShape(builder);
            const state = this.captureState(context);
            this.recorder.addNode(
                new ShapeNode(shape, state)
            );
        }

        emitShape(shape, context) {
            const state = this.captureState(context);
            this.recorder.addNode(new ShapeNode(shape, state));
        }
    }

    class SVGImporter {
        constructor(p5){
            this.p5 = p5;
            this.recorder = new ShapeRecorder(p5);
            this.tStack = new TransformStack();
            this.renderContextStack = [new RenderContext()];
            this.styleResolver = new StyleResolver();
            this.transformResolver = new TransformResolver();
            this.shapeBuilder = new ShapeBuilder(
                p5,
                this.recorder,
                this.tStack
            );
            this.definitions = new Map();
            this.activeRefs = new Set();
        }

        get currentRenderContext() {
            return this.renderContextStack[
                this.renderContextStack.length - 1
            ];
        }
        import(svg) {
            const host = document.createElement("div");
            host.style.position = "absolute";
            host.style.left = "-99999px";
            host.style.visibility = "hidden";
            host.style.pointerEvents = "none";

            document.body.appendChild(host);
            try {
                host.appendChild(svg);
                this.styleResolver.preprocess(svg);
                this.buildIdMap(svg);
                this.visit(host.firstChild);
            } finally {
                host.remove();
            }
            const record = this.recorder.getRecord();
            record.sourceSVG = svg.cloneNode(true);

            let viewBox = undefined;
            if (svg.viewBox && svg.viewBox.baseVal) {
                try {
                    const vb = svg.viewBox.baseVal;
                    if (
                        typeof vb.x === "number" &&
                        typeof vb.y === "number" &&
                        typeof vb.width === "number" &&
                        typeof vb.height === "number" &&
                        vb.width > 0 &&
                        vb.height > 0
                    ) {
                        viewBox = {
                            x: vb.x,
                            y: vb.y,
                            width: vb.width,
                            height: vb.height
                        };
                    }
                } catch (e) {
                    // Ignore DOMException
                }
            }
            if (!viewBox && svg.hasAttribute && svg.hasAttribute("viewBox")) {
                const rawVb = svg.getAttribute("viewBox").trim();
                const parts = rawVb.split(/[\s,]+/).map((v) => parseFloat(v));
                if (parts.length === 4 && !parts.some((v) => isNaN(v)) && parts[2] > 0 && parts[3] > 0) {
                    viewBox = {
                        x: parts[0],
                        y: parts[1],
                        width: parts[2],
                        height: parts[3]
                    };
                }
            }

            let width = undefined;
            if (svg.width && svg.width.baseVal) {
                try {
                    const val = svg.width.baseVal.value;
                    if (typeof val === "number" && !isNaN(val) && val > 0) {
                        width = val;
                    }
                } catch (e) {
                    // Ignore
                }
            }
            if (width === undefined && svg.hasAttribute && svg.hasAttribute("width")) {
                const parsedW = parseFloat(svg.getAttribute("width"));
                if (!isNaN(parsedW)) {
                    width = parsedW;
                }
            }

            let height = undefined;
            if (svg.height && svg.height.baseVal) {
                try {
                    const val = svg.height.baseVal.value;
                    if (typeof val === "number" && !isNaN(val) && val > 0) {
                        height = val;
                    }
                } catch (e) {
                    // Ignore
                }
            }
            if (height === undefined && svg.hasAttribute && svg.hasAttribute("height")) {
                const parsedH = parseFloat(svg.getAttribute("height"));
                if (!isNaN(parsedH)) {
                    height = parsedH;
                }
            }

            record.width = width;
            record.height = height;
            record.viewBox = viewBox;

            if (viewBox) {
                record.coordinateBounds = {
                    x: viewBox.x,
                    y: viewBox.y,
                    width: viewBox.width,
                    height: viewBox.height
                };
            } else if (width != null && height != null) {
                record.coordinateBounds = {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                };
            }

            return record;
        }

        buildIdMap(node) {
            if (node.id && !this.definitions.has(node.id)) {
                this.definitions.set(node.id, node);
            }
            for (const child of node.children) {
                this.buildIdMap(child);
            }
        }

        visit(node) {
            if (!node) {
                return;
            }
            const visitor = VISITORS[node.localName];
            if (!visitor) {
                return;
            }
            this.tStack.push();
            this.transformResolver.apply(node, this.tStack);
            const parentContext = this.currentRenderContext;
            const context = this.styleResolver.resolveNodeStyle(node, parentContext);
            this.renderContextStack.push(context);

            if (context.display === "none") {
                this.renderContextStack.pop();
                this.tStack.pop();
                return;
            }
            visitor.call(this, node, context);

            this.renderContextStack.pop();
            this.tStack.pop();
        }

        withRefGuard(refId, fn) {
            if (this.activeRefs.has(refId)) {
                return; // cycle detected — bail silently
            }
            this.activeRefs.add(refId);
            try {
                fn();
            } finally {
                this.activeRefs.delete(refId);
            }
        }

        num(node, attr, fallback = 0) {
            if (!node.hasAttribute(attr)) {
                return fallback;
            }
            if (node[attr] && node[attr].baseVal) {
                return node[attr].baseVal.value;
            }
            const val = node.getAttribute(attr);
            return parseLength(val, fallback);
        }

        visitSVG(node) {
            for (const child of node.children) {
                this.visit(child);
            }
        }

        visitGroup(node) {
            this.recorder.enterScope();

            for (const child of node.children) {
                this.visit(child);
            }

            this.recorder.leaveScope();
        }


        visitDefs() {
            // Definitions are collected during preprocessing.
            // Rendering happens when referenced via <use>.
        }

        visitUse(node) {
            const href = node.getAttribute("href") || node.getAttribute("xlink:href");
            if (!href || !href.startsWith("#")) {
                return;
            }

            const refId = href.slice(1);
            const referenced = this.definitions.get(refId);
            if (!referenced) {
                return;
            }

            this.withRefGuard(refId, () => {
                const x = this.num(node, "x");
                const y = this.num(node, "y");
                if (x !== 0 || y !== 0) {
                    this.tStack.current.translateSelf(x, y);
                }
                const vb = referenced.viewBox?.baseVal;
                if (vb && vb.width && vb.height) {
                    const w = node.hasAttribute("width")
                        ? this.num(node, "width")
                        : (referenced.width?.baseVal?.value || vb.width);
                    const h = node.hasAttribute("height")
                        ? this.num(node, "height")
                        : (referenced.height?.baseVal?.value || vb.height);

                    const scale = Math.min(w / vb.width, h / vb.height); // default: xMidYMid meet
                    this.tStack.current.translateSelf(
                        (w - vb.width * scale) / 2 - vb.x * scale,
                        (h - vb.height * scale) / 2 - vb.y * scale
                    );
                    this.tStack.current.scaleSelf(scale, scale);
                }
                this.visit(referenced);
            });
        }

        visitCircle(node, context) {
            const r = this.num(node, "r");
            if (r <= 0) return;

            this.shapeBuilder.addPrimitive(context, shape => {
                shape.ellipsePrimitive(
                    this.num(node, "cx") - r,
                    this.num(node, "cy") - r,
                    r * 2,
                    r * 2
                );
            });
        }

        visitEllipse(node, context) {
            const rx = this.num(node, "rx", NaN);
            const ry = this.num(node, "ry", NaN);

            const { rx: resolvedRx, ry: resolvedRy } = resolvePairedRadii(rx, ry);

            if (resolvedRx <= 0 || resolvedRy <= 0) return;
            this.shapeBuilder.addPrimitive(context, shape => {
                shape.ellipsePrimitive(
                    this.num(node, "cx") - resolvedRx,
                    this.num(node, "cy") - resolvedRy,
                    resolvedRx * 2,
                    resolvedRy * 2
                );
            });
        }

        visitLine(node, context) {
            this.shapeBuilder.addPrimitive(context, shape => {
                shape.line(
                    this.num(node, "x1"),
                    this.num(node, "y1"),
                    this.num(node, "x2"),
                    this.num(node, "y2")
                );
            });
        }

        visitRect(node, context) {
            const w = this.num(node, "width");
            const h = this.num(node, "height");
            if (w <= 0 || h <= 0) return;

            const rx = this.num(node, "rx", null);
            const ry = this.num(node, "ry", null);

            const { rx: resolvedRx, ry: resolvedRy } = resolvePairedRadii(rx, ry);

            const x = this.num(node, "x");
            const y = this.num(node, "y");

            let clampedRx = Math.max(0, Math.min(resolvedRx, w / 2));
            let clampedRy = Math.max(0, Math.min(resolvedRy, h / 2));
            if (clampedRx === 0 || clampedRy === 0) {
                clampedRx = 0;
                clampedRy = 0;
            }

            if (clampedRx > 0 && clampedRy > 0 && clampedRx !== clampedRy) {
                this.shapeBuilder.addPrimitive(context, shape => {
                    this.buildRoundedRect(shape, x, y, w, h, clampedRx, clampedRy);
                });
            } else {
                this.shapeBuilder.addPrimitive(context, shape => {
                    this.buildSimpleRect(shape, x, y, w, h, clampedRx);
                });
            }
        }

        visitPolygon(node, context) {
            const points = this.getNativePoints(node);
            this.shapeBuilder.addPrimitive(context, shape => {
                for (const pt of points) {
                    shape.vertex(new p5.Vector(pt.x, pt.y));
                }
                shape.endShape(this.p5.CLOSE);
            });
        }

        visitPolyline(node, context) {
            const points = this.getNativePoints(node);
            this.shapeBuilder.addPrimitive(context, shape => {
                for (const pt of points) {
                    shape.vertex(new p5.Vector(pt.x, pt.y));
                }
            });
        }

        visitPath(node, context) {
            this.shapeBuilder.addPrimitive(context, shape => {
                if (typeof node.getPathData === "function") {
                    this.buildFromPathData(shape, node.getPathData());
                } else {
                    const d = node.getAttribute("d") || "";
                    this.buildFromLegacyPath(shape, d);
                }
            });
        }

        emitCubicSegments(shape, segments) {
            for (const seg of segments) {
                this.emitSingleCubic(shape, seg.cp1, seg.cp2, seg.end);
            }
        }

        emitSingleCubic(shape, cp1, cp2, end) {
            shape.bezierOrder(3);
            shape.bezierVertex(new p5.Vector(cp1.x, cp1.y));
            shape.bezierVertex(new p5.Vector(cp2.x, cp2.y));
            shape.bezierVertex(new p5.Vector(end.x, end.y));
        }

        buildRoundedRect(shape, x, y, w, h, rx, ry) {
            const k = 0.5523;

            // Start
            shape.vertex(new p5.Vector(x + rx, y));

            // Top edge
            shape.vertex(new p5.Vector(x + w - rx, y));

            // Top-right corner
            this.emitSingleCubic(
                shape,
                { x: x + w - rx + rx * k, y: y },
                { x: x + w, y: y + ry - ry * k },
                { x: x + w, y: y + ry }
            );

            // Right edge
            shape.vertex(new p5.Vector(x + w, y + h - ry));

            // Bottom-right corner
            this.emitSingleCubic(
                shape,
                { x: x + w, y: y + h - ry + ry * k },
                { x: x + w - rx + rx * k, y: y + h },
                { x: x + w - rx, y: y + h }
            );

            // Bottom edge
            shape.vertex(new p5.Vector(x + rx, y + h));

            // Bottom-left corner
            this.emitSingleCubic(
                shape,
                { x: x + rx - rx * k, y: y + h },
                { x: x, y: y + h - ry + ry * k },
                { x: x, y: y + h - ry }
            );

            // Left edge
            shape.vertex(new p5.Vector(x, y + ry));

            // Top-left corner
            this.emitSingleCubic(
                shape,
                { x: x, y: y + ry - ry * k },
                { x: x + rx - rx * k, y: y },
                { x: x + rx, y: y }
            );

            shape.endShape(this.p5.CLOSE);
        }

        buildSimpleRect(shape, x, y, w, h, r) {
            if (r > 0) {
                shape.rectPrimitive(x, y, w, h, r, r, r, r);
            } else {
                shape.rectPrimitive(x, y, w, h);
            }
        }

        parsePointsAttribute(pointsAttr) {
            const points = [];
            const matches = pointsAttr.match(/-?[\d.]+/g);
            if (matches) {
                for (let i = 0; i < matches.length - 1; i += 2) {
                    const x = parseFloat(matches[i]);
                    const y = parseFloat(matches[i + 1]);
                    if (!isNaN(x) && !isNaN(y)) {
                        points.push({ x, y });
                    }
                }
            }
            return points;
        }

        getNativePoints(node) {
            const list = node.points;
            if (list && list.numberOfItems > 0) {
                const points = [];
                for (let i = 0; i < list.numberOfItems; i++) {
                    const pt = list.getItem(i);
                    points.push({ x: pt.x, y: pt.y });
                }
                return points;
            }

            const pointsAttr = node.getAttribute("points");
            return pointsAttr ? this.parsePointsAttribute(pointsAttr) : [];
        }

        // --- Legacy fallback parser ------------------------------------------------

        parsePathData(d) {
            const commands = [];
            let i = 0;
            const len = d.length;

            let currentCommand = '';
            let argIndexForCommand = 0;
            let currentCommandObj = null;
            let isCurrentCommandObjPushed = false;

            // Helper to skip whitespace and commas
            function skipWhitespaceAndCommas() {
                while (i < len) {
                    const char = d[i];
                    if (char === ' ' || char === '\t' || char === '\r' || char === '\n' || char === ',') {
                        i++;
                    } else {
                        break;
                    }
                }
            }

            const COMMANDS = "MmLlHhVvCcSsQqTtAaZz";
            function isCommandChar(char) {
                return COMMANDS.includes(char);
            }

            while (i < len) {
                skipWhitespaceAndCommas();
                if (i >= len) break;

                const char = d[i];

                // 1. Check if it's a command
                if (isCommandChar(char)) {
                    currentCommand = char;
                    argIndexForCommand = 0;
                    currentCommandObj = { type: char };
                    const cmdMeta = PATH_COMMANDS[char];
                    if (cmdMeta && cmdMeta.args.length === 0) {
                        commands.push(currentCommandObj);
                        isCurrentCommandObjPushed = true;
                    } else {
                        isCurrentCommandObjPushed = false;
                    }
                    i++;
                    continue;
                }

                const argName = PATH_COMMANDS[currentCommand]?.args[argIndexForCommand];
                const isFlag = argName === "largeArc" || argName === "sweep";

                if (isFlag) {
                    // A flag is just a single character: '0' or '1'
                    if (char === '0' || char === '1') {
                        const numVal = Number(char);
                        if (currentCommandObj) {
                            if (!isCurrentCommandObjPushed) {
                                commands.push(currentCommandObj);
                                isCurrentCommandObjPushed = true;
                            }
                            const argName = PATH_COMMANDS[currentCommand].args[argIndexForCommand];
                            currentCommandObj[argName] = numVal;
                        }
                        argIndexForCommand++;
                        if (argIndexForCommand >= 7) {
                            argIndexForCommand = 0; // Wrap around for repeated arc parameters
                        }
                        i++;
                    } else {
                        // Invalid flag, abort parsing to avoid infinite loop
                        warnOnce("SVG Importer Warning: Malformed SVG path data (invalid arc flag).");
                        break;
                    }
                } else {
                    // Parse a general float/number
                    const slice = d.substring(i);
                    const numMatch = slice.match(/^[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/);
                    if (numMatch) {
                        const numStr = numMatch[0];
                        const numVal = Number(numStr);
                        i += numStr.length;

                        if (currentCommandObj) {
                            if (!isCurrentCommandObjPushed) {
                                commands.push(currentCommandObj);
                                isCurrentCommandObjPushed = true;
                            }
                            const argName = PATH_COMMANDS[currentCommand].args[argIndexForCommand];
                            currentCommandObj[argName] = numVal;
                        }

                        // Update parameter index for the current command
                        if (currentCommand) {
                            const cmdMeta = PATH_COMMANDS[currentCommand];
                            const totalArgs = cmdMeta ? cmdMeta.args.length : 0;
                            if (totalArgs > 0) {
                                argIndexForCommand++;
                                if (argIndexForCommand >= totalArgs) {
                                    currentCommand = cmdMeta.implicit;
                                    argIndexForCommand = 0;
                                    currentCommandObj = { type: currentCommand };
                                    isCurrentCommandObjPushed = false;
                                }
                            }
                        }
                    } else {
                        // Unrecognized character (skip to prevent infinite loop)
                        warnOnce("SVG Importer Warning: Malformed SVG path data (unrecognized character).");
                        i++;
                    }
                }
            }


            return commands;
        }

        arcToBezier(x1, y1, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x2, y2) {
            if (x1 === x2 && y1 === y2) {
                return [];
            }
            if (rx === 0 || ry === 0) {
                return [{
                    cp1: { x: x1, y: y1 },
                    cp2: { x: x2, y: y2 },
                    end: { x: x2, y: y2 }
                }];
            }

            rx = Math.abs(rx);
            ry = Math.abs(ry);

            const phi = (xAxisRotation * Math.PI) / 180;
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);

            const dx = (x1 - x2) / 2;
            const dy = (y1 - y2) / 2;
            const x1p = cosPhi * dx + sinPhi * dy;
            const y1p = -sinPhi * dx + cosPhi * dy;

            let rxSq = rx * rx;
            let rySq = ry * ry;
            const x1pSq = x1p * x1p;
            const y1pSq = y1p * y1p;

            let radiiCheck = x1pSq / rxSq + y1pSq / rySq;
            if (radiiCheck > 1) {
                rx *= Math.sqrt(radiiCheck);
                ry *= Math.sqrt(radiiCheck);
                rxSq = rx * rx;
                rySq = ry * ry;
            }

            const sign = largeArcFlag === sweepFlag ? -1 : 1;
            const sq = (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq);
            const coef = sign * Math.sqrt(Math.max(0, sq));
            const cxp = coef * ((rx * y1p) / ry);
            const cyp = coef * -((ry * x1p) / rx);

            const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
            const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

            const sx = (x1p - cxp) / rx;
            const sy = (y1p - cyp) / ry;
            const tx = (-x1p - cxp) / rx;
            const ty = (-y1p - cyp) / ry;

            const angleBetween = (ux, uy, vx, vy) => {
                const dot = ux * vx + uy * vy;
                const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
                let angle = Math.acos(Math.max(-1, Math.min(1, dot / len)));
                if (ux * vy - uy * vx < 0) {
                    angle = -angle;
                }
                return angle;
            };

            const theta1 = angleBetween(1, 0, sx, sy);
            let deltaTheta = angleBetween(sx, sy, tx, ty);

            if (sweepFlag === 0 && deltaTheta > 0) {
                deltaTheta -= 2 * Math.PI;
            } else if (sweepFlag === 1 && deltaTheta < 0) {
                deltaTheta += 2 * Math.PI;
            }

            const segments = Math.ceil(Math.abs(deltaTheta) / (Math.PI / 2));
            const bezierSegments = [];

            let tStart = theta1;
            const tDiv = deltaTheta / segments;

            for (let i = 0; i < segments; i++) {
                const tEnd = tStart + tDiv;
                const alpha = Math.sin(tDiv) * (Math.sqrt(4 + 3 * Math.tan(tDiv / 2) * Math.tan(tDiv / 2)) - 1) / 3;

                const cosStart = Math.cos(tStart);
                const sinStart = Math.sin(tStart);
                const cosEnd = Math.cos(tEnd);
                const sinEnd = Math.sin(tEnd);

                const eX1 = cosStart - alpha * sinStart;
                const eY1 = sinStart + alpha * cosStart;
                const eX2 = cosEnd + alpha * sinEnd;
                const eY2 = sinEnd - alpha * cosEnd;
                const eX3 = cosEnd;
                const eY3 = sinEnd;

                const transformPoint = (x, y) => {
                    const rxX = rx * x;
                    const ryY = ry * y;
                    return {
                        x: cosPhi * rxX - sinPhi * ryY + cx,
                        y: sinPhi * rxX + cosPhi * ryY + cy
                    };
                };

                const cp1 = transformPoint(eX1, eY1);
                const cp2 = transformPoint(eX2, eY2);
                const end = transformPoint(eX3, eY3);

                bezierSegments.push({ cp1, cp2, end });
                tStart = tEnd;
            }

            return bezierSegments;
        }

        // --- Path Geometry Handlers ---

        handlePathM(shape, state, args) {
            const { x, y } = args;
            state.currentX = x;
            state.currentY = y;
            state.startX = state.currentX;
            state.startY = state.currentY;
            if (!state.isFirstContour) {
                shape.beginContour();
            }
            state.isFirstContour = false;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathm(shape, state, args) {
            const { dx, dy } = args;
            state.currentX += dx;
            state.currentY += dy;
            state.startX = state.currentX;
            state.startY = state.currentY;
            if (!state.isFirstContour) {
                shape.beginContour();
            }
            state.isFirstContour = false;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathL(shape, state, args) {
            const { x, y } = args;
            state.currentX = x;
            state.currentY = y;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathl(shape, state, args) {
            const { dx, dy } = args;
            state.currentX += dx;
            state.currentY += dy;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathH(shape, state, args) {
            const {x} = args;
            state.currentX = x;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathh(shape, state, args) {
            const {dx} = args;
            state.currentX += dx;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathV(shape, state, args) {
            const {y} = args;
            state.currentY = y;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathv(shape, state, args) {
            const {dy} = args;
            state.currentY += dy;
            shape.vertex(new p5.Vector(state.currentX, state.currentY));
            state.lastControlX = state.currentX;
            state.lastControlY = state.currentY;
        }

        handlePathC(shape, state, args) {
            const { x1: cp1x, y1: cp1y, x2: cp2x, y2: cp2y, x: endx, y: endy } = args;
            shape.bezierOrder(3);
            shape.bezierVertex(new p5.Vector(cp1x, cp1y));
            shape.bezierVertex(new p5.Vector(cp2x, cp2y));
            shape.bezierVertex(new p5.Vector(endx, endy));
            state.lastControlX = cp2x;
            state.lastControlY = cp2y;
            state.currentX = endx;
            state.currentY = endy;
        }

        handlePathc(shape, state, args) {
            const { dx1: cp1dx, dy1: cp1dy, dx2: cp2dx, dy2: cp2dy, dx: enddx, dy: enddy } = args;
            const absCp1x = cp1dx + state.currentX;
            const absCp1y = cp1dy + state.currentY;
            const absCp2x = cp2dx + state.currentX;
            const absCp2y = cp2dy + state.currentY;
            const absEndx = enddx + state.currentX;
            const absEndy = enddy + state.currentY;
            shape.bezierOrder(3);
            shape.bezierVertex(new p5.Vector(absCp1x, absCp1y));
            shape.bezierVertex(new p5.Vector(absCp2x, absCp2y));
            shape.bezierVertex(new p5.Vector(absEndx, absEndy));
            state.lastControlX = absCp2x;
            state.lastControlY = absCp2y;
            state.currentX = absEndx;
            state.currentY = absEndy;
        }

        handlePathS(shape, state, args) {
            const { x2: cp2x, y2: cp2y, x: endx, y: endy } = args;
            let cp1x = state.currentX;
            let cp1y = state.currentY;
            if (state.lastCommand === 'C' || state.lastCommand === 'c' || state.lastCommand === 'S' || state.lastCommand === 's') {
                cp1x = 2 * state.currentX - state.lastControlX;
                cp1y = 2 * state.currentY - state.lastControlY;
            }
            shape.bezierOrder(3);
            shape.bezierVertex(new p5.Vector(cp1x, cp1y));
            shape.bezierVertex(new p5.Vector(cp2x, cp2y));
            shape.bezierVertex(new p5.Vector(endx, endy));
            state.lastControlX = cp2x;
            state.lastControlY = cp2y;
            state.currentX = endx;
            state.currentY = endy;
        }

        handlePaths(shape, state, args) {
            const { dx2: cp2dx, dy2: cp2dy, dx: enddx, dy: enddy } = args;
            const absCp2x = cp2dx + state.currentX;
            const absCp2y = cp2dy + state.currentY;
            const absEndx = enddx + state.currentX;
            const absEndy = enddy + state.currentY;
            let cp1dx = state.currentX;
            let cp1dy = state.currentY;
            if (state.lastCommand === 'C' || state.lastCommand === 'c' || state.lastCommand === 'S' || state.lastCommand === 's') {
                cp1dx = 2 * state.currentX - state.lastControlX;
                cp1dy = 2 * state.currentY - state.lastControlY;
            }
            shape.bezierOrder(3);
            shape.bezierVertex(new p5.Vector(cp1dx, cp1dy));
            shape.bezierVertex(new p5.Vector(absCp2x, absCp2y));
            shape.bezierVertex(new p5.Vector(absEndx, absEndy));
            state.lastControlX = absCp2x;
            state.lastControlY = absCp2y;
            state.currentX = absEndx;
            state.currentY = absEndy;
        }

        handlePathQ(shape, state, args) {
            const { x1: cpx, y1: cpy, x: endx, y: endy } = args;
            shape.bezierOrder(2);
            shape.bezierVertex(new p5.Vector(cpx, cpy));
            shape.bezierVertex(new p5.Vector(endx, endy));
            state.lastControlX = cpx;
            state.lastControlY = cpy;
            state.currentX = endx;
            state.currentY = endy;
        }

        handlePathq(shape, state, args) {
            const { dx1: cpdx, dy1: cpdy, dx: enddx, dy: enddy } = args;
            const absCpx = cpdx + state.currentX;
            const absCpy = cpdy + state.currentY;
            const absEndx = enddx + state.currentX;
            const absEndy = enddy + state.currentY;
            shape.bezierOrder(2);
            shape.bezierVertex(new p5.Vector(absCpx, absCpy));
            shape.bezierVertex(new p5.Vector(absEndx, absEndy));
            state.lastControlX = absCpx;
            state.lastControlY = absCpy;
            state.currentX = absEndx;
            state.currentY = absEndy;
        }

        handlePathT(shape, state, args) {
            const { x: endx, y: endy } = args;
            let cpx = state.currentX;
            let cpy = state.currentY;
            if (state.lastCommand === 'Q' || state.lastCommand === 'q' || state.lastCommand === 'T' || state.lastCommand === 't') {
                cpx = 2 * state.currentX - state.lastControlX;
                cpy = 2 * state.currentY - state.lastControlY;
            }
            shape.bezierOrder(2);
            shape.bezierVertex(new p5.Vector(cpx, cpy));
            shape.bezierVertex(new p5.Vector(endx, endy));
            state.lastControlX = cpx;
            state.lastControlY = cpy;
            state.currentX = endx;
            state.currentY = endy;
        }

        handlePatht(shape, state, args) {
            const { dx: enddx, dy: enddy } = args;
            const absEndx = enddx + state.currentX;
            const absEndy = enddy + state.currentY;
            let cpx = state.currentX;
            let cpy = state.currentY;
            if (state.lastCommand === 'Q' || state.lastCommand === 'q' || state.lastCommand === 'T' || state.lastCommand === 't') {
                cpx = 2 * state.currentX - state.lastControlX;
                cpy = 2 * state.currentY - state.lastControlY;
            }
            shape.bezierOrder(2);
            shape.bezierVertex(new p5.Vector(cpx, cpy));
            shape.bezierVertex(new p5.Vector(absEndx, absEndy));
            state.lastControlX = cpx;
            state.lastControlY = cpy;
            state.currentX = absEndx;
            state.currentY = absEndy;
        }

        handlePathA(shape, state, args) {
            const { rx, ry, rotation: xAxisRotation, largeArc: largeArcFlag, sweep: sweepFlag, x: endx, y: endy } = args;
            const segments = this.arcToBezier(state.currentX, state.currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, endx, endy);
            this.emitCubicSegments(shape, segments);
            state.lastControlX = state.currentX = endx;
            state.lastControlY = state.currentY = endy;
        }

        handlePatha(shape, state, args) {
            const { rx, ry, rotation: xAxisRotation, largeArc: largeArcFlag, sweep: sweepFlag, dx: enddx, dy: enddy } = args;
            const absEndx = enddx + state.currentX;
            const absEndy = enddy + state.currentY;
            const segments = this.arcToBezier(state.currentX, state.currentY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, absEndx, absEndy);
            this.emitCubicSegments(shape, segments);
            state.lastControlX = state.currentX = absEndx;
            state.lastControlY = state.currentY = absEndy;
        }

        buildFromCommands(shape, commands) {
            const state = {
                currentX: 0,
                currentY: 0,
                lastControlX: 0,
                lastControlY: 0,
                startX: 0,
                startY: 0,
                lastCommand: '',
                isFirstContour: true
            };

            for (const cmdObj of commands) {
                const cmd = cmdObj.type;

                if (cmd === 'Z' || cmd === 'z') {
                    shape.endContour(this.p5.CLOSE);
                    state.currentX = state.startX;
                    state.currentY = state.startY;
                    state.lastControlX = state.currentX;
                    state.lastControlY = state.currentY;
                    state.lastCommand = cmd;
                    continue;
                }

                const handler = PATH_HANDLERS[cmd];
                if (handler) {
                    handler.call(this, shape, state, cmdObj);
                }
                state.lastCommand = cmd;
            }
        }

        buildFromLegacyPath(shape, d) {
            const commands = this.parsePathData(d);
            this.buildFromCommands(shape, commands);
        }

        buildFromPathData(shape, pathData) {
            const commands = pathData.map(cmd => {
                const command = { type: cmd.type };
                const argNames = PATH_COMMANDS[cmd.type].args;

                argNames.forEach((name, i) => {
                    command[name] = cmd.values[i];
                });
                return command;
            });
            this.buildFromCommands(shape, commands);
        }
    }

     const VISITORS = Object.freeze({
        svg: SVGImporter.prototype.visitSVG,
        g: SVGImporter.prototype.visitGroup,
        symbol: SVGImporter.prototype.visitGroup,
        circle: SVGImporter.prototype.visitCircle,
        ellipse: SVGImporter.prototype.visitEllipse,
        line: SVGImporter.prototype.visitLine,
        rect: SVGImporter.prototype.visitRect,
        polygon: SVGImporter.prototype.visitPolygon,
        polyline: SVGImporter.prototype.visitPolyline,
        path: SVGImporter.prototype.visitPath,
        defs: SVGImporter.prototype.visitDefs,
        use: SVGImporter.prototype.visitUse,
    });

    const PATH_HANDLERS = Object.freeze({
        M: SVGImporter.prototype.handlePathM,
        m: SVGImporter.prototype.handlePathm,
        L: SVGImporter.prototype.handlePathL,
        l: SVGImporter.prototype.handlePathl,
        H: SVGImporter.prototype.handlePathH,
        h: SVGImporter.prototype.handlePathh,
        V: SVGImporter.prototype.handlePathV,
        v: SVGImporter.prototype.handlePathv,
        C: SVGImporter.prototype.handlePathC,
        c: SVGImporter.prototype.handlePathc,
        S: SVGImporter.prototype.handlePathS,
        s: SVGImporter.prototype.handlePaths,
        Q: SVGImporter.prototype.handlePathQ,
        q: SVGImporter.prototype.handlePathq,
        T: SVGImporter.prototype.handlePathT,
        t: SVGImporter.prototype.handlePatht,
        A: SVGImporter.prototype.handlePathA,
        a: SVGImporter.prototype.handlePatha,
    });

    // Helper function that parses SVG XML markup or accepts an SVG DOM element,
    // importing it into a RecordedShape via SVGImporter.
    function createSVGText(pInst, input) {
        let svg;

        if (typeof input === "string") {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, "image/svg+xml");
            svg = doc.documentElement;
        } else {
            svg = input;
        }
        const importer = new SVGImporter(pInst);
        return importer.import(svg);
    }

    // Synchronously converts an SVG string or DOM element into a RecordedShape instance.
    fn.createSVG = function (input) {
        return createSVGText(this, input);
    };

    // Asynchronously loads an external SVG file from a URL path,
    // returning a Promise that resolves to a RecordedShape instance.



    fn.loadSVG = async function (
        path,
        successCallback,
        failureCallback
    ) {
        try {
            const req = new Request(path, {
                method: 'GET',
                mode: 'cors'
            });
            let svgText;
            if (typeof request === 'function') {
                const { data } = await request(req, 'text');
                svgText = data;
            } else {
                const response = await fetch(req);
                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${path}`);
                }
                svgText = await response.text();
            }
            const shape = createSVGText(this, svgText);
            const cb = () => {
                if (successCallback) {
                    return successCallback(shape);
                }
                return shape;
            };
            return this._internal
                ? this._internal(cb)
                : cb();
        } catch (err) {
            if (typeof p5._friendlyFileLoadError === 'function') {
                p5._friendlyFileLoadError(1, path);
            }
            if (typeof failureCallback === 'function') {
                return failureCallback(err);
            } else {
                throw err;
            }
        }
    };
}

if (typeof p5 !== 'undefined') {
  p5.registerAddon(SVGImportAddon);
}