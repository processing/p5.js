// This file holds the "browersify" task which compiles the individual src/ code into p5.js and p5.min.js.

'use strict';

import { resolve } from 'path';
import browserify from 'browserify';
import { format } from 'prettier';
import derequire from 'derequire';

const bannerTemplate =
  '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> \n\n                    GNU LESSER GENERAL PUBLIC LICENSE\n                       Version 2.1, February 1999\n\n Copyright (C) 1991, 1999 Free Software Foundation, Inc.\n 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA\n Everyone is permitted to copy and distribute verbatim copies\n of this license document, but changing it is not allowed.\n\n(This is the first released version of the Lesser GPL.  It also counts\n as the successor of the GNU Library Public License, version 2, hence\n the version number 2.1.)\n\n                            Preamble\n\n  The licenses for most software are designed to take away your\nfreedom to share and change it.  By contrast, the GNU General Public\nLicenses are intended to guarantee your freedom to share and change\nfree software--to make sure the software is free for all its users.\n\n  This license, the Lesser General Public License, applies to some\nspecially designated software packages--typically libraries--of the\nFree Software Foundation and other authors who decide to use it.  You\ncan use it too, but we suggest you first think carefully about whether\nthis license or the ordinary General Public License is the better\nstrategy to use in any particular case, based on the explanations below.\n\n  When we speak of free software, we are referring to freedom of use,\nnot price.  Our General Public Licenses are designed to make sure that\nyou have the freedom to distribute copies of free software (and charge\nfor this service if you wish); that you receive source code or can get\nit if you want it; that you can change the software and use pieces of\nit in new free programs; and that you are informed that you can do\nthese things.\n\n  To protect your rights, we need to make restrictions that forbid\ndistributors to deny you these rights or to ask you to surrender these\nrights.  These restrictions translate to certain responsibilities for\nyou if you distribute copies of the library or if you modify it.\n\n  For example, if you distribute copies of the library, whether gratis\nor for a fee, you must give the recipients all the rights that we gave\nyou.  You must make sure that they, too, receive or can get the source\ncode.  If you link other code with the library, you must provide\ncomplete object files to the recipients, so that they can relink them\nwith the library after making changes to the library and recompiling\nit.  And you must show them these terms so they know their rights.\n\n  We protect your rights with a two-step method: (1) we copyright the\nlibrary, and (2) we offer you this license, which gives you legal\npermission to copy, distribute and/or modify the library.\n\n  To protect each distributor, we want to make it very clear that\nthere is no warranty for the free library.  Also, if the library is\nmodified by someone else and passed on, the recipients should know\nthat what they have is not the original version, so that the original\nauthor\'s reputation will not be affected by problems that might be\nintroduced by others.\n\n  Finally, software patents pose a constant threat to the existence of\nany free program.  We wish to make sure that a company cannot\neffectively restrict the users of a free program by obtaining a\nrestrictive license from a patent holder.  Therefore, we insist that\nany patent license obtained for a version of the library must be\nconsistent with the full freedom of use specified in this license.\n\n  Most GNU software, including some libraries, is covered by the\nordinary GNU General Public License.  This license, the GNU Lesser\nGeneral Public License, applies to certain designated libraries, and\nis quite different from the ordinary General Public License.  We use\nthis license for certain libraries in order to permit linking those\nlibraries into non-free programs.\n\n  When a program is linked with a library, whether statically or using\na shared library, the combination of the two is legally speaking a\ncombined work, a derivative of the original library.  The ordinary\nGeneral Public License therefore permits such linking only if the\nentire combination fits its criteria of freedom.  The Lesser General\nPublic License permits more lax criteria for linking other code with\nthe library.\n\n  We call this license the "Lesser" General Public License because it\ndoes Less to protect the user\'s freedom than the ordinary General\nPublic License.  It also provides other free software developers Less\nof an advantage over competing non-free programs.  These disadvantages\nare the reason we use the ordinary General Public License for many\nlibraries.  However, the Lesser license provides advantages in certain\nspecial circumstances.\n\n  For example, on rare occasions, there may be a special need to\nencourage the widest possible use of a certain library, so that it becomes\na de-facto standard.  To achieve this, non-free programs must be\nallowed to use the library.  A more frequent case is that a free\nlibrary does the same job as widely used non-free libraries.  In this\ncase, there is little to gain by limiting the free library to free\nsoftware only, so we use the Lesser General Public License.\n\n  In other cases, permission to use a particular library in non-free\nprograms enables a greater number of people to use a large body of\nfree software.  For example, permission to use the GNU C Library in\nnon-free programs enables many more people to use the whole GNU\noperating system, as well as its variant, the GNU/Linux operating\nsystem.\n\n  Although the Lesser General Public License is Less protective of the\nusers\' freedom, it does ensure that the user of a program that is\nlinked with the Library has the freedom and the wherewithal to run\nthat program using a modified version of the Library.\n\n  The precise terms and conditions for copying, distribution and\nmodification follow.  Pay close attention to the difference between a\n"work based on the library" and a "work that uses the library".  The\nformer contains code derived from the library, whereas the latter must\nbe combined with the library in order to run.\n\n                  GNU LESSER GENERAL PUBLIC LICENSE\n   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION\n\n  0. This License Agreement applies to any software library or other\nprogram which contains a notice placed by the copyright holder or\nother authorized party saying it may be distributed under the terms of\nthis Lesser General Public License (also called "this License").\nEach licensee is addressed as "you".\n\n  A "library" means a collection of software functions and/or data\nprepared so as to be conveniently linked with application programs\n(which use some of those functions and data) to form executables.\n\n  The "Library", below, refers to any such software library or work\nwhich has been distributed under these terms.  A "work based on the\nLibrary" means either the Library or any derivative work under\ncopyright law: that is to say, a work containing the Library or a\nportion of it, either verbatim or with modifications and/or translated\nstraightforwardly into another language.  (Hereinafter, translation is\nincluded without limitation in the term "modification".)\n\n  "Source code" for a work means the preferred form of the work for\nmaking modifications to it.  For a library, complete source code means\nall the source code for all modules it contains, plus any associated\ninterface definition files, plus the scripts used to control compilation\nand installation of the library.\n\n  Activities other than copying, distribution and modification are not\ncovered by this License; they are outside its scope.  The act of\nrunning a program using the Library is not restricted, and output from\nsuch a program is covered only if its contents constitute a work based\non the Library (independent of the use of the Library in a tool for\nwriting it).  Whether that is true depends on what the Library does\nand what the program that uses the Library does.\n\n  1. You may copy and distribute verbatim copies of the Library\'s\ncomplete source code as you receive it, in any medium, provided that\nyou conspicuously and appropriately publish on each copy an\nappropriate copyright notice and disclaimer of warranty; keep intact\nall the notices that refer to this License and to the absence of any\nwarranty; and distribute a copy of this License along with the\nLibrary.\n\n  You may charge a fee for the physical act of transferring a copy,\nand you may at your option offer warranty protection in exchange for a\nfee.\n\n  2. You may modify your copy or copies of the Library or any portion\nof it, thus forming a work based on the Library, and copy and\ndistribute such modifications or work under the terms of Section 1\nabove, provided that you also meet all of these conditions:\n\n    a) The modified work must itself be a software library.\n\n    b) You must cause the files modified to carry prominent notices\n    stating that you changed the files and the date of any change.\n\n    c) You must cause the whole of the work to be licensed at no\n    charge to all third parties under the terms of this License.\n\n    d) If a facility in the modified Library refers to a function or a\n    table of data to be supplied by an application program that uses\n    the facility, other than as an argument passed when the facility\n    is invoked, then you must make a good faith effort to ensure that,\n    in the event an application does not supply such function or\n    table, the facility still operates, and performs whatever part of\n    its purpose remains meaningful.\n\n    (For example, a function in a library to compute square roots has\n    a purpose that is entirely well-defined independent of the\n    application.  Therefore, Subsection 2d requires that any\n    application-supplied function or table used by this function must\n    be optional: if the application does not supply it, the square\n    root function must still compute square roots.)\n\nThese requirements apply to the modified work as a whole.  If\nidentifiable sections of that work are not derived from the Library,\nand can be reasonably considered independent and separate works in\nthemselves, then this License, and its terms, do not apply to those\nsections when you distribute them as separate works.  But when you\ndistribute the same sections as part of a whole which is a work based\non the Library, the distribution of the whole must be on the terms of\nthis License, whose permissions for other licensees extend to the\nentire whole, and thus to each and every part regardless of who wrote\nit.\n\nThus, it is not the intent of this section to claim rights or contest\nyour rights to work written entirely by you; rather, the intent is to\nexercise the right to control the distribution of derivative or\ncollective works based on the Library.\n\nIn addition, mere aggregation of another work not based on the Library\nwith the Library (or with a work based on the Library) on a volume of\na storage or distribution medium does not bring the other work under\nthe scope of this License.\n\n  3. You may opt to apply the terms of the ordinary GNU General Public\nLicense instead of this License to a given copy of the Library.  To do\nthis, you must alter all the notices that refer to this License, so\nthat they refer to the ordinary GNU General Public License, version 2,\ninstead of to this License.  (If a newer version than version 2 of the\nordinary GNU General Public License has appeared, then you can specify\nthat version instead if you wish.)  Do not make any other change in\nthese notices.\n\n  Once this change is made in a given copy, it is irreversible for\nthat copy, so the ordinary GNU General Public License applies to all\nsubsequent copies and derivative works made from that copy.\n\n  This option is useful when you wish to copy part of the code of\nthe Library into a program that is not a library.\n\n  4. You may copy and distribute the Library (or a portion or\nderivative of it, under Section 2) in object code or executable form\nunder the terms of Sections 1 and 2 above provided that you accompany\nit with the complete corresponding machine-readable source code, which\nmust be distributed under the terms of Sections 1 and 2 above on a\nmedium customarily used for software interchange.\n\n  If distribution of object code is made by offering access to copy\nfrom a designated place, then offering equivalent access to copy the\nsource code from the same place satisfies the requirement to\ndistribute the source code, even though third parties are not\ncompelled to copy the source along with the object code.\n\n  5. A program that contains no derivative of any portion of the\nLibrary, but is designed to work with the Library by being compiled or\nlinked with it, is called a "work that uses the Library".  Such a\nwork, in isolation, is not a derivative work of the Library, and\ntherefore falls outside the scope of this License.\n\n  However, linking a "work that uses the Library" with the Library\ncreates an executable that is a derivative of the Library (because it\ncontains portions of the Library), rather than a "work that uses the\nlibrary".  The executable is therefore covered by this License.\nSection 6 states terms for distribution of such executables.\n\n  When a "work that uses the Library" uses material from a header file\nthat is part of the Library, the object code for the work may be a\nderivative work of the Library even though the source code is not.\nWhether this is true is especially significant if the work can be\nlinked without the Library, or if the work is itself a library.  The\nthreshold for this to be true is not precisely defined by law.\n\n  If such an object file uses only numerical parameters, data\nstructure layouts and accessors, and small macros and small inline\nfunctions (ten lines or less in length), then the use of the object\nfile is unrestricted, regardless of whether it is legally a derivative\nwork.  (Executables containing this object code plus portions of the\nLibrary will still fall under Section 6.)\n\n  Otherwise, if the work is a derivative of the Library, you may\ndistribute the object code for the work under the terms of Section 6.\nAny executables containing that work also fall under Section 6,\nwhether or not they are linked directly with the Library itself.\n\n  6. As an exception to the Sections above, you may also combine or\nlink a "work that uses the Library" with the Library to produce a\nwork containing portions of the Library, and distribute that work\nunder terms of your choice, provided that the terms permit\nmodification of the work for the customer\'s own use and reverse\nengineering for debugging such modifications.\n\n  You must give prominent notice with each copy of the work that the\nLibrary is used in it and that the Library and its use are covered by\nthis License.  You must supply a copy of this License.  If the work\nduring execution displays copyright notices, you must include the\ncopyright notice for the Library among them, as well as a reference\ndirecting the user to the copy of this License.  Also, you must do one\nof these things:\n\n    a) Accompany the work with the complete corresponding\n    machine-readable source code for the Library including whatever\n    changes were used in the work (which must be distributed under\n    Sections 1 and 2 above); and, if the work is an executable linked\n    with the Library, with the complete machine-readable "work that\n    uses the Library", as object code and/or source code, so that the\n    user can modify the Library and then relink to produce a modified\n    executable containing the modified Library.  (It is understood\n    that the user who changes the contents of definitions files in the\n    Library will not necessarily be able to recompile the application\n    to use the modified definitions.)\n\n    b) Use a suitable shared library mechanism for linking with the\n    Library.  A suitable mechanism is one that (1) uses at run time a\n    copy of the library already present on the user\'s computer system,\n    rather than copying library functions into the executable, and (2)\n    will operate properly with a modified version of the library, if\n    the user installs one, as long as the modified version is\n    interface-compatible with the version that the work was made with.\n\n    c) Accompany the work with a written offer, valid for at\n    least three years, to give the same user the materials\n    specified in Subsection 6a, above, for a charge no more\n    than the cost of performing this distribution.\n\n    d) If distribution of the work is made by offering access to copy\n    from a designated place, offer equivalent access to copy the above\n    specified materials from the same place.\n\n    e) Verify that the user has already received a copy of these\n    materials or that you have already sent this user a copy.\n\n  For an executable, the required form of the "work that uses the\nLibrary" must include any data and utility programs needed for\nreproducing the executable from it.  However, as a special exception,\nthe materials to be distributed need not include anything that is\nnormally distributed (in either source or binary form) with the major\ncomponents (compiler, kernel, and so on) of the operating system on\nwhich the executable runs, unless that component itself accompanies\nthe executable.\n\n  It may happen that this requirement contradicts the license\nrestrictions of other proprietary libraries that do not normally\naccompany the operating system.  Such a contradiction means you cannot\nuse both them and the Library together in an executable that you\ndistribute.\n\n  7. You may place library facilities that are a work based on the\nLibrary side-by-side in a single library together with other library\nfacilities not covered by this License, and distribute such a combined\nlibrary, provided that the separate distribution of the work based on\nthe Library and of the other library facilities is otherwise\npermitted, and provided that you do these two things:\n\n    a) Accompany the combined library with a copy of the same work\n    based on the Library, uncombined with any other library\n    facilities.  This must be distributed under the terms of the\n    Sections above.\n\n    b) Give prominent notice with the combined library of the fact\n    that part of it is a work based on the Library, and explaining\n    where to find the accompanying uncombined form of the same work.\n\n  8. You may not copy, modify, sublicense, link with, or distribute\nthe Library except as expressly provided under this License.  Any\nattempt otherwise to copy, modify, sublicense, link with, or\ndistribute the Library is void, and will automatically terminate your\nrights under this License.  However, parties who have received copies,\nor rights, from you under this License will not have their licenses\nterminated so long as such parties remain in full compliance.\n\n  9. You are not required to accept this License, since you have not\nsigned it.  However, nothing else grants you permission to modify or\ndistribute the Library or its derivative works.  These actions are\nprohibited by law if you do not accept this License.  Therefore, by\nmodifying or distributing the Library (or any work based on the\nLibrary), you indicate your acceptance of this License to do so, and\nall its terms and conditions for copying, distributing or modifying\nthe Library or works based on it.\n\n  10. Each time you redistribute the Library (or any work based on the\nLibrary), the recipient automatically receives a license from the\noriginal licensor to copy, distribute, link with or modify the Library\nsubject to these terms and conditions.  You may not impose any further\nrestrictions on the recipients\' exercise of the rights granted herein.\nYou are not responsible for enforcing compliance by third parties with\nthis License.\n\n  11. If, as a consequence of a court judgment or allegation of patent\ninfringement or for any other reason (not limited to patent issues),\nconditions are imposed on you (whether by court order, agreement or\notherwise) that contradict the conditions of this License, they do not\nexcuse you from the conditions of this License.  If you cannot\ndistribute so as to satisfy simultaneously your obligations under this\nLicense and any other pertinent obligations, then as a consequence you\nmay not distribute the Library at all.  For example, if a patent\nlicense would not permit royalty-free redistribution of the Library by\nall those who receive copies directly or indirectly through you, then\nthe only way you could satisfy both it and this License would be to\nrefrain entirely from distribution of the Library.\n\nIf any portion of this section is held invalid or unenforceable under any\nparticular circumstance, the balance of the section is intended to apply,\nand the section as a whole is intended to apply in other circumstances.\n\nIt is not the purpose of this section to induce you to infringe any\npatents or other property right claims or to contest validity of any\nsuch claims; this section has the sole purpose of protecting the\nintegrity of the free software distribution system which is\nimplemented by public license practices.  Many people have made\ngenerous contributions to the wide range of software distributed\nthrough that system in reliance on consistent application of that\nsystem; it is up to the author/donor to decide if he or she is willing\nto distribute software through any other system and a licensee cannot\nimpose that choice.\n\nThis section is intended to make thoroughly clear what is believed to\nbe a consequence of the rest of this License.\n\n  12. If the distribution and/or use of the Library is restricted in\ncertain countries either by patents or by copyrighted interfaces, the\noriginal copyright holder who places the Library under this License may add\nan explicit geographical distribution limitation excluding those countries,\nso that distribution is permitted only in or among countries not thus\nexcluded.  In such case, this License incorporates the limitation as if\nwritten in the body of this License.\n\n  13. The Free Software Foundation may publish revised and/or new\nversions of the Lesser General Public License from time to time.\nSuch new versions will be similar in spirit to the present version,\nbut may differ in detail to address new problems or concerns.\n\nEach version is given a distinguishing version number.  If the Library\nspecifies a version number of this License which applies to it and\n"any later version", you have the option of following the terms and\nconditions either of that version or of any later version published by\nthe Free Software Foundation.  If the Library does not specify a\nlicense version number, you may choose any version ever published by\nthe Free Software Foundation.\n\n  14. If you wish to incorporate parts of the Library into other free\nprograms whose distribution conditions are incompatible with these,\nwrite to the author to ask for permission.  For software which is\ncopyrighted by the Free Software Foundation, write to the Free\nSoftware Foundation; we sometimes make exceptions for this.  Our\ndecision will be guided by the two goals of preserving the free status\nof all derivatives of our free software and of promoting the sharing\nand reuse of software generally.\n\n                            NO WARRANTY\n\n  15. BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO\nWARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE LAW.\nEXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR\nOTHER PARTIES PROVIDE THE LIBRARY "AS IS" WITHOUT WARRANTY OF ANY\nKIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\nPURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE\nLIBRARY IS WITH YOU.  SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME\nTHE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.\n\n  16. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN\nWRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY\nAND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE LIABLE TO YOU\nFOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR\nCONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE\nLIBRARY (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING\nRENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A\nFAILURE OF THE LIBRARY TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF\nSUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH\nDAMAGES.\n\n                     END OF TERMS AND CONDITIONS\n*/';

module.exports = function(grunt) {
  const srcFilePath = require.resolve('../../src/app.js');

  grunt.registerTask(
    'browserify',
    'Compile the p5.js source with Browserify',
    function(param) {
      const isMin = param === 'min';
      const isTest = param === 'test';
      const isDev = param === 'dev';

      const filename = isMin
        ? 'p5.pre-min.js'
        : isTest ? 'p5-test.js' : 'p5.js';

      // This file will not exist until it has been built
      const libFilePath = resolve('lib/' + filename);

      // Reading and writing files is asynchronous
      const done = this.async();

      // Render the banner for the top of the file
      const banner = grunt.template.process(bannerTemplate);

      let globalVars = {};
      if (isDev) {
        globalVars['P5_DEV_BUILD'] = () => true;
      }
      // Invoke Browserify programatically to bundle the code
      let browserified = browserify(srcFilePath, {
        standalone: 'p5',
        insertGlobalVars: globalVars
      });

      if (isMin) {
        // These paths should be the exact same as what are used in the import
        // statements in the source. They are not relative to this file. It's
        // just how browserify works apparently.
        browserified = browserified
          .exclude('../../docs/reference/data.json')
          .exclude('../../../docs/parameterData.json')
          .exclude('../../translations')
          .exclude('./browser_errors')
          .ignore('i18next')
          .ignore('i18next-browser-languagedetector');
      }

      if (!isDev) {
        browserified = browserified.exclude('../../translations/dev');
      }

      const babelifyOpts = { plugins: ['static-fs'] };

      if (isTest) {
        babelifyOpts.envName = 'test';
      }

      const bundle = browserified.transform('babelify', babelifyOpts).bundle();

      // Start the generated output with the banner comment,
      let code = banner + '\n';

      // Then read the bundle into memory so we can run it through derequire
      bundle
        .on('data', function(data) {
          code += data;
        })
        .on('end', function() {
          code = code.replace(
            `'VERSION_CONST_WILL_BE_REPLACED_BY_BROWSERIFY_BUILD_PROCESS'`,
            grunt.template.process(`'<%= pkg.version %>'`)
          );

          // "code" is complete: create the distributable UMD build by running
          // the bundle through derequire
          // (Derequire changes the bundle's internal "require" function to
          // something that will not interfere with this module being used
          // within a separate browserify bundle.)
          code = derequire(code);

          // and prettify the code
          if (!isMin) {
            code = format(code, {
              singleQuote: true,
              printWidth: 80 + 12
            });
          }

          // finally, write it to disk
          grunt.file.write(libFilePath, code);

          // Print a success message
          grunt.log.writeln(
            '>>'.green + ' Bundle ' + ('lib/' + filename).cyan + ' created.'
          );

          // Complete the task
          done();
        });
    }
  );
};
