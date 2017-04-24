/**
 * MIX fis conf file
 * 
 * @author  Yang,junlong at 2016-06-22 10:12:17 build.
 * @version $Id$
 */

// 基础配置信息 命名空间
fis.config.merge({
    //namespace: 'mix',
    project : {
        // 使用project.exclude排除某些后缀 svn、cvs默认已排除
        exclude : [/\.(tar|rar|psd|jar|bat|sh|md|git|bak)$/i, /^\/mix\/lib\/est/i]
    }
});

fis.config.merge({
	// 插件安装
    modules: {
        parser: {
            less: 'less',
        },
        postprocessor: {
            js: 'jswrapper, require-async'
            //html: 'amd'
        },
        postpackager: 'modjs'
    },
    // 插件配置
    settings : {
        postprocessor : {
            jswrapper: {
                type: 'amd'
            }
        },
        postpackager: {
        	modjs: {
        		subpath: 'pkg/map.js',
                useType: false
        	}
        }
    },

    roadmap : {
        ext : {
            less : 'css'
        },
        path : [
            {
                reg: /LICENSE/i,
                release: false
            },
            {
                reg: 'server.conf',
                release: '/WEB-INF/server.conf'
            },
            {
                reg: /^\/(test)\/(.*)/i,
                isMod: false,
                release: '/$1/$2'
            },
            {
                reg: /^\/app\/index\.html$/i,
                isMod: true,
                useMap: false,
                release: '/views/index.html'
            },

            {
                reg: /^\/app\/module\/(.+\.(?:html))$/i,
                isMod: true,
                //url: '/page/$1',
                useHash: true,
                release: '/static/app/module/$1'
            },

            {
                // .html|css 后缀的文件不加入map.json
                reg: /^(.*(.+\.(?:html|css)))$/i,
                useMap: false,
                url: '/static/$1',
                release: '/static/$1'
            },
            {
                reg: /^(?!.*mod.js)(.*$)/i,
                isMod: true,
                url: '/static/$1',
                release: '/static/$1'
            },
            {
                // default
                reg: /^.+$/,
                release: '/static/$&'
            }
        ]
    }
});

// limit jello command
if (fis.require.prefixes[0] != 'fis') {
    //fis.log.error('Please use the `fis` command!\nUsage: jello release -wL');
}

// stdout.write some info...
process.stdout.write('\n β start complie '.yellow +fis.config.get('namespace')+' project ...\n'.yellow);
