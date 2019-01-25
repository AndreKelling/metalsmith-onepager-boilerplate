'use strict';
var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var discoverPartials = require('metalsmith-discover-partials');
var rootPath = require('metalsmith-rootpath');
var ignore  = require('metalsmith-ignore');
var permalinks  = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var shortcodes = require('metalsmith-shortcodes-replace');
var handlebars = require('handlebars');
var debug = require('metalsmith-debug');
var glob = require('glob');
var path = require('path');

/**
 * Add custom helpers to handlebars using the global handlebars instance
 * https://github.com/superwolff/metalsmith-layouts/issues/63
 *
 */
glob.sync('layouts/helpers/*.js').forEach((fileName) => {
  const helper = fileName.split('/').pop().replace('.js', '')

  handlebars.registerHelper(
    helper,
    require(`./${fileName}`)
  )
});

/**
 *  Export your Metalsmith build to use in gulp.
 *
 *  Metalsmith will look for a folder named `src` in `__dirname`.
 *  Use the source() method if you want to point Metalsmith to a different `src` folder/location.
 *  Then we set the destination folder using the destination() method.
 *
 *  Note that we are not calling the `Metalsmith.build()` here. We will start the build in the gulp file.
 */
module.exports = Metalsmith(__dirname)

    .clean(false)

    // Where shall we build?
    .destination('./build')

    // Process metadata
    .metadata({
        "site": {
            "name": "Your Site Title Here",
            "description": "A starter template for Onepager websites with Metalsmith + Gulp",
            "url": "https://github.com/AndreKelling/metalsmith-onepager-boilerplate",
            "author": "André Kelling",
            "email": "contact@andrekelling.de",
            "keywords": [
                "Your",
                "Keywords",
                "Here"
            ]
        },
        "version": require('./package.json').version
    })

    // Expose `rootPath` to each file
    .use(rootPath())

    .use(collections({
        onepager: {
            pattern: 'onepager/**/*.html',
            sortBy: 'order'
        }
    }))

    .use(permalinks({
        relative: 'on'
    }))

    .use(shortcodes({
        shortcodes: [
            {
                clean_cache: true, // @todo: activate cache, set false or remove
                name: 'img',
                replace: function (params, match) {
                    //console.log(params, match);
                    // @todo: add breakpoints and different image sizes
                    const fileParse = path.parse(params.src);
                    const fileName = '/img/' + fileParse.name; // remove file extension https://stackoverflow.com/a/31615711
                    const fileExt = fileParse.ext;
                    //console.log(fileParse);
                    // @todo: add noscript image
                    return '<picture>' +
                        '<source\n' +
                        '   media="(min-width: 768px)"' +
                        '   data-srcset="'+fileName+'-l.webp 1x, '+fileName+'-xl.webp 2x"' +
                        '   type="image/webp" >' +
                        '<source\n' +
                        '   media="(min-width: 500px)"' +
                        '   data-srcset="'+fileName+'-m.webp 1x, '+fileName+'-l.webp 2x"' +
                        '   type="image/webp" >' +
                        '<source\n' +
                        '   data-srcset="'+fileName+'-s.webp 1x, '+fileName+'-m.webp 2x"' +
                        '   type="image/webp" >' +
                        '<img' +
                        '   data-srcset="'+fileName+'-m.'+fileExt+' 500w,' +
                        '   '+fileName+'-l.'+fileExt+' 768w,' +
                        '   '+fileName+'-xl.'+fileExt+' 1200w"' +
                        '   data-src="'+fileName+'-xs.'+fileExt+'"' +
                      //  '   type="image/jpeg"' +
                        '   alt="'+params.alt+'"' +
                        '   class="lazyload">' +
                        '</picture>'
                },
            }
        ]
    }))

    // Process handlebars partials
    .use(discoverPartials({
        directory: './layouts/partials',
    }))

    // Process handlebars templates
    .use(layouts({
        engine: 'handlebars',
    }))

    // Ignore Onepager Partials
    .use(ignore([
        'onepager/**'
    ]))

    //.use(debug())
