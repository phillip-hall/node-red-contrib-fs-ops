/**
 * Copyright 2016 Dean Cording <dean@cording.id.au>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

const util = require('util');
const fs = require('fs');
const path = require('path');


getProperty(name, type) {
    if (type === 'str') {
        return name;
    } else if (type === 'msg') {
        return RED.util.getMessageProperty(msg,name).toString();
    } else if (type === 'flow') {
        return node.context().flow.get(name).toString();
    } else if (type === 'global') {
        return node.context().global.get(name).toString();
    }
}



module.exports = function(RED) {
    "use strict";

    function MoveNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.sourcePath = n.sourcePath || "";
        node.sourcePathType = n.sourcePathType || "str";
        node.sourceFilename = n.sourceFilename || "";
        node.sourceFilenameType = n.sourceFilenameType || "str";
        node.destPath = n.destPath || "";
        node.destPathType = n.destPathType || "str";
        node.destFilename = n.destFilename || "";
        node.destFilenameType = n.destFilenameType || "str";

        node.on("input", function(msg) {

            var source = "";
            var dest = "";

            source = getProperty(node.sourcePath, node.sourcePathType);

/**            if (node.sourcePathType === 'str') {
                source = node.sourcePath;
            } else if (node.sourcePathType === 'msg') {
                source = RED.util.getMessageProperty(msg,node.sourcePath).toString();
            } else if (node.sourcePathType === 'flow') {
                source = node.context().flow.get(node.sourcePath).toString();
            } else if (node.sourcePathType === 'global') {
                source = node.context().global.get(node.sourcePath).toString();
            }
**/
            if ((source.length > 0) && (source.lastIndexOf(path.sep) != source.length-1)) {
                source += path.sep;
            }

            if (node.sourceFilenameType === 'str') {
                source += node.sourceFilename;
            } else if (node.sourceFilenameType === 'msg') {
                source += RED.util.getMessageProperty(msg,node.sourceFilename).toString();
            } else if (node.sourceFilenameType === 'flow') {
                source += node.context().flow.get(node.sourceFilename).toString();
            } else if (node.sourceFilenameType === 'global') {
                source += node.context().global.get(node.sourceFilename).toString();
            }

            if (node.destPathType === 'str') {
                dest = node.destPath;
            } else if (node.destPathType === 'msg') {
                dest = RED.util.getMessageProperty(msg,node.destPath).toString();
            } else if (node.destPathType === 'flow') {
                dest = node.context().flow.get(node.destPath).toString();
            } else if (node.destPathType === 'global') {
                dest = node.context().global.get(node.destPath).toString();
            }

            if ((dest.length > 0) && (dest.lastIndexOf(path.sep) != dest.length-1)) {
                dest += path.sep;
            }

            if (node.destFilenameType === 'str') {
                dest += node.destFilename;
            } else if (node.destFilenameType === 'msg') {
                dest += RED.util.getMessageProperty(msg,node.destFilename).toString();
            } else if (node.destFilenameType === 'flow') {
                dest += node.context().flow.get(node.destFilename).toString();
            } else if (node.destFilenameType === 'global') {
                dest += node.context().global.get(node.destFilename).toString();
            }

            fs.renameSync(source, dest);

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-move", MoveNode);

    function DeleteNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.filename = n.filename || "";
        node.filenameType = n.filenameType || "msg";

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            if ((pathname.length > 0) && (pathname.lastIndexOf(path.sep) != pathname.length-1)) {
                pathname += path.sep;
            }

            if (node.filenameType === 'str') {
                pathname += node.filename;
            } else if (node.filenameType === 'msg') {
                pathname += RED.util.getMessageProperty(msg,node.filename).toString();
            } else if (node.filenameType === 'flow') {
                pathname += node.context().flow.get(node.filename).toString();
            } else if (node.filenameType === 'global') {
                pathname += node.context().global.get(node.filename).toString();
            }

            try {
                fs.unlinkSync(pathname);
            } catch (e) {
                // Deleting a non-existent file is not an error
                if (e.errno != -2) {
                    node.error(e, msg);
                    return null;
                }
            }

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-delete", DeleteNode);

    function AccessNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.filename = n.filename || "";
        node.filenameType = n.filenameType || "str";
        node.read = n.read;
        node.write = n.write;

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            if ((pathname.length > 0) && (pathname.lastIndexOf(path.sep) != pathname.length-1)) {
                pathname += path.sep;
            }

            if (node.filenameType === 'str') {
                pathname += node.filename;
            } else if (node.filenameType === 'msg') {
                pathname += RED.util.getMessageProperty(msg,node.filename).toString();
            } else if (node.filenameType === 'flow') {
                pathname += node.context().flow.get(node.filename).toString();
            } else if (node.filenameType === 'global') {
                pathname += node.context().global.get(node.filename).toString();
            }

            var mode = fs.F_OK;
            if (node.read) mode |= fs.R_OK;
            if (node.write) mode |= fs.W_OK;

            try {
                fs.accessSync(pathname, mode);
            } catch (e) {
                node.error("File " + pathname + " is not accessible " + e, msg);
                return null;
            }

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-access", AccessNode);


    function SizeNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.filename = n.filename || "";
        node.filenameType = n.filenameType || "msg";
        node.size = n.size || "";
        node.sizeType = n.sizeType || "msg";

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            if ((pathname.length > 0) && (pathname.lastIndexOf(path.sep) != pathname.length-1)) {
                pathname += path.sep;
            }

            if (node.filenameType === 'str') {
                pathname += node.filename;
            } else if (node.filenameType === 'msg') {
                pathname += RED.util.getMessageProperty(msg,node.filename).toString();
            } else if (node.filenameType === 'flow') {
                pathname += node.context().flow.get(node.filename).toString();
            } else if (node.filenameType === 'global') {
                pathname += node.context().global.get(node.filename).toString();
            }

            var size = fs.statSync(pathname).size;

            if (node.sizeType === 'msg') {
                RED.util.setMessageProperty(msg,node.size, size);
            } else if (node.sizeType === 'flow') {
                node.context().flow.set(node.size, size);
            } else if (node.sizeType === 'global') {
                node.context().global.get(node.size, size);
            }

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-size", SizeNode);


    function DirNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.filter = n.filter || "*";
        node.filterType = n.filterType || "msg";
        node.dir = n.dir || "";
        node.dirType = n.dirType || "msg";

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            var filter = "*";

            if (node.filterType === 'str') {
                filter = node.filter;
            } else if (node.filterType === 'msg') {
                filter = RED.util.getMessageProperty(msg,node.filter).toString();
            } else if (node.filterType === 'flow') {
                filter = node.context().flow.get(node.filter).toString();
            } else if (node.filterType === 'global') {
                filter = node.context().global.get(node.filter).toString();
            }

            filter = filter.replace('.', '\\.');
            filter = filter.replace('*', '.*');
            filter = new RegExp(filter);

            var dir = fs.readdirSync(pathname);
            dir = dir.filter(function(value) { return filter.test(value); });

            if (node.dirType === 'msg') {
                RED.util.setMessageProperty(msg,node.dir, dir);
            } else if (node.dirType === 'flow') {
                node.context().flow.set(node.dir, dir);
            } else if (node.dirType === 'global') {
                node.context().global.get(node.dir, dir);
            }


            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-dir", DirNode);

    function MkdirNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.dirname = n.dirname || "";
        node.dirnameType = n.dirnameType || "msg";
        node.mode = parseInt(n.mode, 8);
        node.fullpath = n.fullpath || "";

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            if ((pathname.length > 0) && (pathname.lastIndexOf(path.sep) != pathname.length-1)) {
                pathname += path.sep;
            }

            if (node.dirnameType === 'str') {
                pathname += node.dirname;
            } else if (node.dirnameType === 'msg') {
                pathname += RED.util.getMessageProperty(msg,node.dirname).toString();
            } else if (node.dirnameType === 'flow') {
                pathname += node.context().flow.get(node.dirname).toString();
            } else if (node.dirnameType === 'global') {
                pathname += node.context().global.get(node.dirname).toString();
            }

            fs.mkdirSync(pathname, node.mode);

            if (node.fullpath.length > 0) {
                RED.util.setMessageProperty(msg, node.fullpath, pathname);
            }

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-mkdir", MkdirNode);

    function MktmpdirNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.path = n.path || "";
        node.pathType = n.pathType || "str";
        node.prefix = n.prefix || "";
        node.prefixType = n.prefixType || "msg";
        node.mode = parseInt(n.mode, 8);
        node.fullpath = n.fullpath || "";

        node.on("input", function(msg) {

            var pathname = "";

            if (node.pathType === 'str') {
                pathname = node.path;
            } else if (node.pathType === 'msg') {
                pathname = RED.util.getMessageProperty(msg,node.path).toString();
            } else if (node.pathType === 'flow') {
                pathname = node.context().flow.get(node.path).toString();
            } else if (node.pathType === 'global') {
                pathname = node.context().global.get(node.path).toString();
            }

            if ((pathname.length > 0) && (pathname.lastIndexOf(path.sep) != pathname.length-1)) {
                pathname += path.sep;
            }

            if (node.prefixType === 'str') {
                pathname += node.prefix;
            } else if (node.prefixType === 'msg') {
                pathname += RED.util.getMessageProperty(msg,node.prefix).toString();
            } else if (node.prefixType === 'flow') {
                pathname += node.context().flow.get(node.prefix).toString();
            } else if (node.prefixType === 'global') {
                pathname += node.context().global.get(node.prefix).toString();
            }

            if (fs.mkdtempSync) {
                pathname = fs.mkdtempSync(pathname, node.mode);

            } else {
                pathname += Math.random().toString(36).slice(2,8);
                fs.mkdir(pathname, node.mode);

            }

            RED.util.setMessageProperty(msg, node.fullpath, pathname);

            node.send(msg);

        });
    }

    RED.nodes.registerType("fs-ops-mktmpdir", MktmpdirNode);

}
