/**
 * @Description: App.emoji.js
 * @Version:     v1.0
 * @Author:      taojiacheng
 */
(function (exports) {

    EmojiUtil = exports.init;

})((function () {

    var exports = {};

    function EmojiUtil() {
    }

    // # All omitted code points have Emoji_Component=No
    // # @missing: 0000..10FFFF  ; Emoji_Component ; No
    //
    // 0023          ; Emoji_Component      # E0.0   [1] (#️)       number sign
    // 002A          ; Emoji_Component      # E0.0   [1] (*️)       asterisk
    // 0030..0039    ; Emoji_Component      # E0.0  [10] (0️..9️)    digit zero..digit nine
    // 200D          ; Emoji_Component      # E0.0   [1] (‍)        zero width joiner
    // 20E3          ; Emoji_Component      # E0.0   [1] (⃣)       combining enclosing keycap
    // FE0F          ; Emoji_Component      # E0.0   [1] ()        VARIATION SELECTOR-16
    // 1F1E6..1F1FF  ; Emoji_Component      # E0.0  [26] (🇦..🇿)    regional indicator symbol letter a..regional indicator symbol letter z
    // 1F3FB..1F3FF  ; Emoji_Component      # E1.0   [5] (🏻..🏿)    light skin tone..dark skin tone
    // 1F9B0..1F9B3  ; Emoji_Component      # E11.0  [4] (🦰..🦳)    red hair..white hair
    // E0020..E007F  ; Emoji_Component      # E0.0  [96] (󠀠..󠁿)      tag space..cancel tag
    EmojiUtil.prototype.data = {
        unicodeSet: new Set(),
        baseReg : /0023|002a|003[0-9]|1f1(e[6-f]|f[0-f])/i,
        spaceReg : /e00[2-7][0-f]/i
    }

    EmojiUtil.prototype.ajax = {
        get: function(url, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    fn.call(this, xhr.responseText);
                }
            };
            xhr.send();
        }
    }

    EmojiUtil.prototype.toCodePointArr = function (unicodeSurrogates, sep) {
        if (!unicodeSurrogates) return []
        var
            r = [],
            c = 0,
            p = 0,
            i = 0;
        while (i < unicodeSurrogates.length) {
            c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码

            if (p) {
                r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16)); //计算4字节的unicode
                p = 0;
            } else if (0xD800 <= c && c <= 0xDBFF) {
                p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
            } else {
                r.push(c.toString(16)); //如果是2字节，直接将码点转为对应的十六进制形式
            }
        }
        return r;
    }

    /**
     * init
     */
    EmojiUtil.prototype.init = function (dataUrl) {
        var _this = this;
        this.ajax.get(dataUrl,function (data) {
            var unicode = data.replace(/^#.*?\n/gm, '').replace(/;.*?\n/gm, '||').replace(/\n/gm, '').split('||');
            unicode.pop();
            unicode.forEach(code => {
                code = code.trim().replace(/ /g,'-');
                _this.data.unicodeSet.add(code)
            });
            console.log( 'loaded emoji '+ _this.data.unicodeSet.size)
            console.log( 'EmojiUtil init OK !')
        })
    };

    EmojiUtil.prototype.unicodeToChar = function(str) {
        var pre = '%u';
        if (str.length<4){
            for (var i = 0;i<(4-str.length);i++){
                pre+='0';
            }
        }
        return unescape(pre+str);
    }

    EmojiUtil.prototype.emoji2string = function (str) {
        var _this = this
        var codePointArr = _this.toCodePointArr(str)
        var stack = []
        var output = ''
        var _try = 0
        for (var i = 0; i < codePointArr.length;i++) {
            var item = codePointArr[i]
            var _zero = ''
            if (item.length<4){
                for (var z = 0;z<(4-item.length);z++){
                    _zero+='0'
                }
                item = _zero + item
            }
            var _pre = ''
            if (stack.length>0){
                // contract pre item
                for (var j=0;j<stack.length;j++){
                    var pre = stack[j]
                    _pre += pre+'-'
                }
            }
            if (stack.length==0 && (_this.data.unicodeSet.has(item.toUpperCase())||_this.data.baseReg.test(item))){
                stack.push(item)
            } else if (stack.length>0) {
                if (item == 'fe0f' || item == '200d' || _this.data.spaceReg.test(item)){
                    stack.push(item)
                    continue
                }
                if (_this.data.unicodeSet.has((_pre+item).toUpperCase())){
                    stack.push(item)
                } else {
                    var nowCode = _pre.substring(0,_pre.length-1)
                    if (nowCode.length<=4&&_this.data.baseReg.test(nowCode)){
                        output+=_this.unicodeToChar(nowCode)
                        _try = 0
                        stack = []
                    } else if (stack[stack.length-1] == '200d') {
                        stack.push(item)
                        _try++
                        continue
                    } else {
                        output+='[ej='+nowCode+']'
                        _try = 0
                        stack = []
                    }
                    i--
                }
            } else {
                output+=_this.unicodeToChar(item)
            }
        }
        if (stack.length>0){
            // contract pre item
            var _pre_ = ''
            for (var e=0;e<stack.length;e++){
                var pre_ = stack[e]
                _pre_ += pre_+'-'
            }
            var nowCode_ = _pre_.substring(0,_pre_.length-1)
            if (nowCode_.length<=4&&_this.data.baseReg.test(nowCode_)){
                output+=_this.unicodeToChar(nowCode_)
            } else {
                output+='[ej='+nowCode_+']'
            }
        }
        return output
    }

    /**
     * open API
     */
    exports.init = function () {
        var args    = Array.prototype.slice.call(arguments)
        var dataUtl  = args.shift();
        // it copy from https://www.unicode.org/Public/emoji/13.0/emoji-test.txt
        // you can input url by args!
        if (!dataUtl) dataUtl = 'https://js2.citysbs.com/0.8.9.73/forum/lib/emoji-data.txt'
        var emojiUtil = new EmojiUtil();
        emojiUtil.init(dataUtl);
        try {
            if (!window.emojiUtil) {
                window.emojiUtil = emojiUtil
            }
        } catch (e) {
            console.error(e)
        }
        return emojiUtil;
    };

    return exports;

})());