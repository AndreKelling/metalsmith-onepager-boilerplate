# metalsmith-gulp-boilerplate [![Build Status](https://travis-ci.com/AndreKelling/metalsmith-onepager-boilerplate.svg?branch=master)](https://travis-ci.com/AndreKelling/metalsmith-onepager-boilerplate)

> A starter template for [Metalsmith](https://github.com/segmentio/metalsmith) + [Gulp](https://github.com/gulpjs/gulp) + [Jest](https://github.com/facebook/jest) projects.

Hardly inspired by [metalsmith-gulp-boilerplate](https://github.com/radiovisual/metalsmith-gulp-boilerplate).
## Installation

1. Make your project folder and clone metalsmith-onepager-boilerplate into it

2. Run the following command within your new project directory:

   ```
   $ npm install
   ```

3. Assuming you have [installed Gulp globally](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally),
start the dev task build/watch process with this command:

   ```
   $ npm run dev
   ```

4. If this is your first build, you might want to package your javascript dependencies with this command:

   ```
   $ npm run build
   ```

5. *Now you are ready to start Metalsmithing!* :thumbsup:

## Usage Notes

#### General

This boilerplate represents an opinionated setup for building static websites with Metalsmith and Gulp. It assumes
you want to use [Browserify](http://browserify.org/) with your custom scripts and helps you wrap all your javascript
dependencies into one file. It uses the [Sass](http://sass-lang.com/) precomplier and [Handlebars](http://handlebarsjs.com/)
templates. Gulp is responsible for the live-reloading (via [BrowserSync](http://www.browsersync.io/)) and the CSS / Browserify
steps. Metalsmith is responsible for compiling/generating the site files.

#### Onepager

There is currently the collection of all sections of the onepager under `src/onepager`. They get looped in the homepage template `layouts/layout-index.hbs` with `{{#each collections.onepager}}`.

It's possible to configure the order the sections get displayed with the `order` index variable given to the single entries.

## Features and Defaults

These are the current defaults, but you can swap these out for anything you want.

- **Templating:** [Handlebars](http://handlebarsjs.com/) *via [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts)*
- **Easy Template Helper Integration**: Any node modules dropped into `layouts/helpers` will automatically be available to your Handlebars templates  
- **Browserify:** [Browserify](http://browserify.org/) your javascript source automatically
- **Unit Testing:** via [Jest](https://github.com/facebook/jest)

#### Dependency

    "metalsmith-collections": "spacedawwwg/metalsmith-collections"

Fix for duplicate output of collections content when running multiple times metalsmith build while dev

## License

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, [André Kelling](https://andrekelling.de) has waived all copyright and related or neighboring rights to this work.
