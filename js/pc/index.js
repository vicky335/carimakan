/**
 * @author Vickyhuang
 */
var Index = {
    init: function(args) {
        // fnBanner
        this.fnBanner.init();
    },

    /**
     *@author VickyHuang
     *@param {Object} options include:
     * @description Banner
     */
    fnBanner: {
        // data: {
        //     bannerObj: $('#header').find('.banner'),
        //     navObj: $('.banner > .nav', '#header'),
        //     timer: null,
        //     intervalTime: 3500,
        //     duration: 700,
        //     curIndex: 0
        // },
        init: function() {
            this.data = {
                bannerObj: $('#header').find('.banner'),
                timer: null,
                intervalTime: 3500,
                duration: 700,
                curIndex: 0,
                width: $('#header').find('.banner').outerWidth(true),
                height: $('#header').find('.banner').outerHeight(true)
            };

            if (this.data.bannerObj.length > 0 && OMIS.os.desktop) {
                var self = this;

                self.effect();
                self.intervalTimer();

                this.data.bannerObj.find('.list > li').width(this.data.width);

                this.data.bannerObj.on('mouseover', function() {
                    clearInterval(self.data.timer);
                }).on('mouseleave', function() {
                    self.intervalTimer();
                }).on('click', '.flag', function() {
                    // self.data.curIndex = $(this).index();
                    self.data.curIndex = $(this).attr('data-index');
                    self.effect();
                    self.intervalTimer();
                });
            }
        },
        intervalTimer: function() {
            var self = this,
                listLen = self.data.bannerObj.find('.list > li').length;
            this.data.timer = setInterval(function() {
                self.data.curIndex = ++self.data.curIndex % listLen;
                self.effect();
            }, this.data.intervalTime);
        },
        effect: function() {
            var self = this,
                cur = this.data.curIndex,
                $list = this.data.bannerObj.find('.list > li'),
                $flag = this.data.bannerObj.find('.flag'),
                scroollWidth = this.data.width * cur;

            $list.stop().fadeOut(this.data.duration).eq(cur).fadeIn(this.data.duration);

            $flag.eq(cur).addClass('cur').siblings().removeClass('cur');
        }
    }
};



$(document).ready(function() {
    Index.init();
});
