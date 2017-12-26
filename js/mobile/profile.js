/**
 * @author Vickyhuang
 */
var Profile = {
    init: function(args) {
        // bindScroll
        this.bindScroll();
    },

    /**
     *@author VickyHuang
     *@param {Object} options include:
     * @description 滾動事件
     */
    bindScroll: function() {
        var $scrollObj = $('.ui_block.list > .scrollfix');
        if ($scrollObj.length > 0) {
            var objOffsetTop = $scrollObj.offset().top;

            if ($('.wrap_header .scrollfix').length > 0) {
                objOffsetTop -= $('.wrap_header .scrollfix').outerHeight(true);
            }

            Com.fnOnScroll(function() {
                var $this = $(this);

                if ($this.scrollTop() >= objOffsetTop) {
                    $scrollObj.addClass('fixed');
                } else {
                    $scrollObj.removeClass('fixed');
                }
            });
        }
    }
};



$(document).ready(function() {
    Profile.init();
});
