/**
 * @author Vickyhuang
 */
var Restaurant = {
    init: function(args) {
        // loadGoogleMapsApi
        Com.loadGoogleMapsApi({
            callback: 'Restaurant.loadGoogleMapsApiCallback'
        });
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
                title: 'Restaurant position'
            });

        marker.addListener('click', function() {
            mapObj.setCenter(marker.getPosition());
            infowindow.open(mapObj, marker);
            OMIS.debug('click', this, mapObj, marker);
        });
    }
};



$(document).ready(function() {
    Restaurant.init();
});
