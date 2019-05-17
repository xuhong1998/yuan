/**
 * 配置进行处理的目录或文件
 */
fis.set('project.ignore', [
    'server/**',
    'client/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'dev/**',
    'dist/**',
    '**/_*.scss',
    '**.sublime-project',
    '**.sublime-workspace',
    'package-lock.json',
    '**.md',
    'fis-conf.js',
    'package.json',
    'MIT-LICENSE'
]);
var xName = "yuan";
//获取当前时间戳
fis.set('timeDate', Date.now());
/*# 生成相对路径*/
fis.hook('relative');
fis.match('**', { relative: true });
/**/
// 引入模块化开发插件，设置规范为 commonJs 规范。
// fis.hook('commonjs', {
//     extList: ['.js', '.jsx', '.es', '.ts', '.tsx']
// })

/**/
fis.match('/node_modules/(**)/(**).js', {
    // isMod: true,
    // useSameNameRequire: true,
    release: '/js/plugins/$2'
});
fis.match('/node_modules/(**)/(**).{ttf,eot,woff,woff2,svg}', {
    release: '/fonts/$2'
});
fis.match('/node_modules/(**)/(**).{css,less}', {
    release: '/css/$2'
});
/*ts*/
fis.match('js/(**).ts', { parser: fis.plugin('typescript'), rExt: '.js' });
/*html*/
fis.match('*.html', { parser: fis.plugin('swig2') });
/*less*/
fis.match('*:less', { parser: fis.plugin('less2', { sourceMap: true }) });
// 当文件中，内嵌 coffee script 时，使用 coffee-script 进行内容 parse.
// fis.match('*:typescript', {parser: fis.plugin('typescript') });
/*less*/

fis.match('/less/(**).less', { parser: fis.plugin('less2', { sourceMap: true }), rExt: '.css', release: '/css/$1' });
fis.match('/less/(**).map', { release: '/css/$1' });
fis.match('/less/core/**', { release: false });
/*模块化加载器配置*/
// fis.match('::package', {
//   postpackager: fis.plugin('loader', {
//     allInOne: true, //js&css打包成一个文件
//     sourceMap: true, //是否生成依赖map文件
//     useInlineMap: true //是否将sourcemap作为内嵌脚本输出
//   })
// });
// fis.match('::package', {
//     // npm install [-g] fis3-postpackager-loader
//     // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
//     postpackager: fis.plugin('loader', {
//         // resourceType: 'commonJs',
//         useInlineMap: true // 资源映射表内嵌
//     })
// });
// 用 loader 来自动引入资源。
fis.match('::package', {
    postpackager: fis.plugin('loader')
});
/**/
fis.unhook('components')
fis.hook('node_modules')

// // #widget源码目录下的资源被标注为组件
// fis.match('/widget/**/*', {
//     isMod: true
// });
// /*开启同名依赖*/
// fis.match('/widget/**', {
//     useSameNameRequire: true

// });
// fis.match('**/*.{html,css,js}', {
//     preprocessor: fis.plugin('gfe-replace', {
//         patterns: [
//             {
//                 match: '__AUTHOR__',
//                 replacement:'T恤NO.1'
//             },
//             {
//                 match: '__ICONFUNT__',
//                 replacement:'//字体路径啊'
//             }
//         ]
//     })
// })
/*#启用 lint 插件进行代码检查*/
// fis.match('*.js', {
//     lint: fis.plugin('js', {

//     })
// })
// /*如果存在部分模块化文件不是以 commonjs 规范编写的，该插件可以通过配置文件属性 umd2commonjs 尝试兼容。
// */
// fis.match('/node_modules/echarts/**.js', {
//   umd2commonjs: true
// })
// /*指定模块化插件*/
// fis.hook('commonjs', {  
//     paths: {
//         jquery: '/static/common/js/mod/jquery', //设置jquery别名
//         react: '/static/common/js/mod/react' //设置react别名
//     }
// });
// /*指定哪些目录下的文件执行define包裹*/
// fis.match('/static/common/js/mod/**', {  
//   isMod: true
// });
// fis.match('/static/common/components/**', {  
//   isMod: true
// });
// fis.match('/static/helloworld/**', {  
//   isMod: true
// });
var d = new Date();
// fis.match('staic/(**)', {release: 'assets/$1'});
fis.media('prod')

.match('{less,css}/**.{css,less,scss}', {
        preprocessor: fis.plugin('autoprefixer', {
            "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
            "cascade": true
        })
    })
    .match('{less,css}/**.{css,less}', {
        optimizer: fis.plugin('clean-css', {
            'keepBreaks': true, //保持一个规则一个换行
            'advanced': false,
            'format': false,
            'aggressiveMerging': false,
            'shorthandCompacting': false,
            // 'compatibility': 'ie7',
            'keepSpecialComments': '*',
            'sourceMap': true,
            // 'relativeTo': file.dirname
        })
    })
    // sass 里面的规范，一般  _ 打头的文件都不 release.
    .match('_*.*', { release: false })

.match('*.png', {
        // fis-optimizer-png-compressor 插件进行压缩，已内置
        optimizer: fis.plugin('png-compressor')
    })
    // .match('*.{js,jsx,ts,tsx,es6,es}', {
    //     optimizer: fis.plugin('uglify-js')
    // })

.match('**', {
    deploy: fis.plugin('local-deliver', {
        // to: '../demo'
        to: '../' + xName + '_HTML'
    })
});
fis.media('zip')
    .match('**', {
        deploy: [
            fis.plugin('zip', {
                filename: `${xName}_${d.getFullYear()}${d.getMonth()+1}${d.getDate()}.zip`
            }),

            fis.plugin('local-deliver', {
                to: `../`
            })
        ]
    })
    // fis.match('{*,**/*}.{js,css}', {
    //     // #js, css 发布后都放到 `public/static` 目录下。
    //     release: '/public/static/$0',
    //     url: '/static/$0'
    // });
    // /*设置发布路径*/
    // fis.match(/\/static\/(.*)/i, {  
    //     release: '/staticPub/$1', /*所有资源发布时产出到 /staticPub 目录下*/
    //     url: '/staticPub/$1' /*所有资源访问路径设置*/
    // });

// /*模块化加载器配置*/
// fis.match('::package', {  
//   postpackager: fis.plugin('loader', {
//     allInOne: true, //js&css打包成一个文件
//     sourceMap: true, //是否生成依赖map文件
//     useInlineMap: true //是否将sourcemap作为内嵌脚本输出
//   })
// });

//     //加载前缀域名
//     .match('static/{upload,img,video}/**.{png,jpg,gif,jpeg,mp4,webm,ogv}',{
//         useHash:false,
//         domain:'//res.360shouji.com',
//         release:'$0',
//         url:'/static/$0'
//     })