/**
 * @author Vickyhuang
 */
var Maps = {
    init: function(args) {
        // showRecommend
        this.showRecommend();
        // loadGoogleMapsApi
        Com.loadGoogleMapsApi({
            callback: 'Maps.loadGoogleMapsApiCallback'
        });
    },
    showRecommend: function() {
        $('.wrap').on('click', '.btn_showrecommend', function() {
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $this.addClass('active');
            } else {
                $this.removeClass('active');
            }
        });
    },
    loadGoogleMapsApiCallback: function() {
        var uluru = {
                lat: -6.224305,
                lng: 106.938922
            },
            mapsInfoHTML = $.templates("#tpl_maps_info").render();
        var mapObj = new google.maps.Map(document.getElementById(mapObjID), {
                zoom: 18,
                center: uluru,
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
                position: uluru,
                map: mapObj
            });

        marker.addListener('click', function() {
            mapObj.setCenter(marker.getPosition());
            infowindow.open(mapObj, marker);
            console.log('click', this, mapObj, marker);
        });
    }
};



$(document).ready(function() {
    Maps.init();
});
