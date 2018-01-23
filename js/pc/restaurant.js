/**
 * @author Vickyhuang
 */
var Restaurant = {
    init: function(args) {
        // loadGoogleMapsApi
        Com.loadGoogleMapsApi({
            callback: 'Restaurant.loadGoogleMapsApiCallback'
        });

        Api.init({
            "appId": $.trim($("meta[property='fb:app_id']").attr("content"))
        });

        // resetImgSize
        this.resetImgSize();
    },

    /**
     *@author VickyHuang
     *@param {Object} options include:
     * @description 加載地圖後回調
     */
    loadGoogleMapsApiCallback: function() {
        var mapsInfoHTML = $.templates("#tpl_maps_info").render(),
            mapObj = new google.maps.Map(document.getElementById(mapObjID), {
                zoom: 18,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            }),
            infowindow = new google.maps.InfoWindow({
                content: mapsInfoHTML,
                maxWidth: 300
            }),
            marker = new google.maps.Marker({ // 此程式碼以在地圖上放置標記。 position 屬性可設定標記的位置
                position: latlng,
                map: mapObj,
                title: 'Restaurant position',
                // icon: '../images/maps/icon_target.png'
                icon: '../images/maps/icon_nearby.png'
            });

        marker.addListener('click', function() {
            mapObj.setCenter(marker.getPosition());
            infowindow.open(mapObj, marker);
            OMIS.debug('click', this, mapObj, marker);
        });
    },

    /**
     * @author VickyHuang
     * @param {Object} "args":
     * @description 計算圖片尺寸
     */
    resetImgSize: function() {
        var $items = $('.shoppics').find('.img');
        $items.each(function(index, item) {
            var $this = $(this),
                data = {
                    width: $this.width(),
                    height: $this.height()
                },
                ratio = data.width / data.height,
                $img = $this.find('img'),
                imgSrc = $img.attr("src");
            $img.removeAttr('width').removeAttr('height');

            imgReady(imgSrc, function() {
                if (this.width / this.height > ratio) {
                    $img.css({
                        height: '100%',
                        width: ''
                    });
                } else {
                    $img.css({
                        width: '100%',
                        height: ''
                    });
                }
            });
        });

        var self = this;
        $(window).resize(function() {
            self.resetImgSize();
        });
    }
};



$(document).ready(function() {
    Restaurant.init();
});
