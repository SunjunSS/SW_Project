<template>
  <PagesHeader />
  <div class="map-container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import homeImage from '@/assets/home.png'
import markerImage from '@/assets/marker.png'
import PagesHeader from '@/components/Bar/PagesHeader.vue'

export default {
  name: 'KakaoMap',
  components: {
    PagesHeader
  },
  created() {
    // 로컬 스토리지 초기화
    localStorage.removeItem('chatMessages')
  },
  data() {
    return {
      map: null,
      overlay: null,
      keywords: ['서점', '문고'],
      currentLocationMarker: null,
      currentLocation: { lat: null, lng: null }, // 현재 위치를 저장할 변수 추가
      homeImage, // 현재 위치 이미지
      markerImage // 마커 이미지
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.initMap)
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=8a69af148a09f10f0d6c0d5c1b4ec459&libraries=services&autoload=false'
      document.head.appendChild(script)
    }
    // 문서 레벨에서 클릭 이벤트 리스너 추가
    document.addEventListener('click', this.handleDocumentClick)
  },
  beforeUnmount() {
    // 컴포넌트 제거 시 이벤트 리스너 제거
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            this.currentLocation = { lat, lng } // 현재 위치 저장
            this.createMap(lat, lng)
          },
          (error) => {
            console.error(error)
            alert('현재 위치를 가져올 수 없습니다. 기본 위치로 설정합니다.')
            this.setDefaultMap()
          }
        )
      } else {
        alert('이 브라우저는 Geolocation을 지원하지 않습니다.')
        this.setDefaultMap()
      }
    },
    createMap(lat, lng) {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 4
      }
      this.map = new kakao.maps.Map(container, options)
      this.displayCurrentLocationImage(lat, lng)
      kakao.maps.event.addListener(this.map, 'idle', this.searchPlaces)
      this.searchPlaces()
    },
    setDefaultMap() {
      this.createMap(37.566826, 126.9786567) // 서울의 기본 위치
    },
    searchPlaces() {
      const ps = new kakao.maps.services.Places(this.map)
      this.keywords.forEach((keyword) => {
        ps.keywordSearch(keyword, this.placesSearchCB, { useMapBounds: true })
      })
    },
    placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        data.forEach(this.displayMarker)
      }
    },
    displayMarker(place) {
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
        zIndex: 1 // 마커의 zIndex를 낮게 설정
      })

      kakao.maps.event.addListener(marker, 'click', () => {
        this.closeOverlay()
        const content = this.createOverlayContent(place)
        this.overlay = new kakao.maps.CustomOverlay({
          content: content,
          map: this.map,
          position: marker.getPosition(),
          xAnchor: 0.5,
          yAnchor: 1.28, // 오버레이 위치 조정 (마커 위에 표시)
          zIndex: 10 // 오버레이의 zIndex를 높게 설정
        })
      })
    },
    createOverlayContent(place) {
      // 현재 위치와 장소 간의 거리 계산
      const distanceInMeters = this.calculateDistance(
        this.currentLocation.lat,
        this.currentLocation.lng,
        place.y,
        place.x
      )

      let distanceText
      if (distanceInMeters < 1000) {
        // 1000 미만인 경우 미터로 표시
        distanceText = `${distanceInMeters.toFixed(2)} m`
      } else {
        // 1000 이상인 경우 킬로미터로 표시
        const distanceInKm = (distanceInMeters / 1000).toFixed(2)
        distanceText = `${distanceInKm} km`
      }

      return `
        <div class="place_overlay">
          <div class="overlay_header">
            <div class="place_name">${place.place_name}</div>
            <div class="close" data-action="close-overlay">X</div>
          </div>
          <div class="address_name">${place.address_name}</div>
          <div class="road_address_name">${place.road_address_name}</div>
          <div class="distance">거리: ${distanceText}</div> 
          <div class="phone">${place.phone ? place.phone : '전화번호 없음'}</div>
          <div class="place_url"><a href="${place.place_url}" target="_blank">자세히 보기</a></div> <!-- 링크 추가 -->
        </div>
      `
    },
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371e3 // 지구의 반지름 (미터)
      const φ1 = (lat1 * Math.PI) / 180 // 위도
      const φ2 = (lat2 * Math.PI) / 180 // 위도
      const Δφ = ((lat2 - lat1) * Math.PI) / 180 // 위도 차이
      const Δλ = ((lng2 - lng1) * Math.PI) / 180 // 경도 차이

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return R * c // 거리 반환 (미터)
    },
    displayCurrentLocationImage(lat, lng) {
      const imageSize = new kakao.maps.Size(35, 35)
      const markerImage = new kakao.maps.MarkerImage(this.homeImage, imageSize) // 수정된 부분
      this.currentLocationMarker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(lat, lng),
        image: markerImage
      })
      kakao.maps.event.addListener(this.currentLocationMarker, 'click', this.closeOverlay)
    },
    closeOverlay() {
      if (this.overlay) {
        this.overlay.setMap(null)
        this.overlay = null
      }
    },
    handleDocumentClick(event) {
      if (event.target.closest('[data-action="close-overlay"]')) {
        this.closeOverlay()
      }
    }
  }
}
</script>

<style>
.home-image {
  width: 40px;
}

.marker-image {
  width: 35px;
}

.now_text {
  font-size: 20px;
}

.book_text {
  font-size: 20px;
}

.map-container {
  position: fixed;
  left: 0;
  right: 0;
  height: 84%;
  margin-top: 40px;
}

.map {
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
.place_overlay {
  position: relative;
  width: 250px;
  font-size: 12px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 오버레이의 z-index를 높게 설정 */
}

.overlay_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  padding-left: 5px;
  background: #eeeeee;
  border-bottom: 1px solid #cacaca;
}

.place_name {
  font-size: 16px;
  font-weight: bold;
}

.close {
  cursor: pointer;
  color: #ff0000;
  font-weight: bold;
  font-size: 20px;
  padding-right: 8px;
}

.address_name,
.road_address_name,
.phone,
.distance,
.place_url {
  padding: 1px;
  padding-left: 5px;
}

.phone {
  color: #007bff;
}

.place_url {
  margin-top: 5px;
}
</style>
