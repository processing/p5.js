import { parseMtlData, mtlToPartState } from '../../../src/webgl/loading';

suite('parseMtlData', function() {
  test('parses a full set of material tokens', function() {
    const mtl = [
      'newmtl shiny',
      'Kd 0.1 0.2 0.3',
      'Ka 0.4 0.5 0.6',
      'Ks 0.7 0.8 0.9',
      'Ns 64',
      'd 0.5',
      'illum 2',
      'map_Kd diffuse.png',
      'map_Ka ambient.png',
      'map_Ks specular.png',
      'map_Bump -bm 0.5 bump.png'
    ].join('\n');

    const materials = parseMtlData(mtl);
    const m = materials.shiny;

    expect(m.diffuseColor).toEqual([0.1, 0.2, 0.3]);
    expect(m.ambientColor).toEqual([0.4, 0.5, 0.6]);
    expect(m.specularColor).toEqual([0.7, 0.8, 0.9]);
    expect(m.shininess).toEqual(64);
    expect(m.opacity).toEqual(0.5);
    expect(m.illuminationModel).toEqual(2);
    expect(m.texturePath).toEqual('diffuse.png');
    expect(m.ambientTexturePath).toEqual('ambient.png');
    expect(m.specularTexturePath).toEqual('specular.png');
    // bump options like -bm precede the path, so the path is the last token.
    expect(m.bumpTexturePath).toEqual('bump.png');
  });

  test('Tr is read as the inverse of d', function() {
    const materials = parseMtlData('newmtl glass\nTr 0.25');
    expect(materials.glass.opacity).toEqual(0.75);
  });

  test('keeps each material separate', function() {
    const materials = parseMtlData(
      'newmtl a\nKd 1 0 0\nnewmtl b\nKd 0 1 0'
    );
    expect(materials.a.diffuseColor).toEqual([1, 0, 0]);
    expect(materials.b.diffuseColor).toEqual([0, 1, 0]);
  });

  test('ignores lines before any newmtl', function() {
    const materials = parseMtlData('Kd 1 1 1\nnewmtl a\nKd 0 0 0');
    expect(materials.a.diffuseColor).toEqual([0, 0, 0]);
    expect(Object.keys(materials)).toEqual(['a']);
  });
});

suite('mtlToPartState', function() {
  test('maps mtl fields onto p5 part-state vocabulary', function() {
    const state = mtlToPartState({
      diffuseColor: [1, 0, 0],
      ambientColor: [0, 1, 0],
      specularColor: [0, 0, 1],
      shininess: 32
    });
    expect(state.fill).toEqual([1, 0, 0, 1]);
    expect(state.ambientColor).toEqual([0, 1, 0]);
    expect(state.specularColor).toEqual([0, 0, 1]);
    expect(state.shininess).toEqual(32);
  });

  test('returns an all-null state for a missing material', function() {
    const state = mtlToPartState(undefined);
    expect(state.fill).toBeNull();
    expect(state.texture).toBeNull();
  });
});
