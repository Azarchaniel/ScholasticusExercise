<template>
  <div class="weather-container">
    <div class="weather-wrap">
      <div class="input-wrap">
        <!--        INPUT-->
        <label for="city_input"></label>
        <input
          type="text"
          placeholder="City name"
          id="city_input"
          class="search-bar"
          v-model="city_input"
          v-on:keypress="fetchWeather"
        />
        <span class="clear-text" @click="clearInput"></span>

        <!--        BUTTONS-->
        <button
          type="button"
          class="btn btn-primary"
          @click="fetchWeather($event)"
        >
          Search
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="getLocation($event)"
        >
          Place
          <!--          SVG for "geoPin"-->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-geo-alt-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
            />
          </svg>
        </button>
      </div>

      <!--  TITLE AND CARDS    -->
      <template v-if="weather.data">
        <div class="h1">
          <div class="pin">
            <!--          SVG for "geoPin"-->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="#007BFF"
              class="bi bi-geo-alt-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
              />
            </svg>
          </div>
          <!--          TITLE - city, country; current date-->
          <h1>
            {{
              weather && weather.data
                ? `${weather.data.name}, ${weather.data.sys.country}`
                : ""
            }}
            <small class="text-muted">{{ curr_date }}</small>
          </h1>
        </div>
        <div>
          <!--      WEATHER CARDS    -->
          <div class="card-wrapper">
            <!--            Temperature card-->
            <div class="card shadow p-3 mb-5 bg-white" style="width: 18rem">
              <div class="card-body">
                <h5 class="card-title">
                  Temperature:
                  <b class="text-primary">{{
                    weather && weather.data
                      ? `${Math.round(weather.data.main.temp)} °C`
                      : ""
                  }}</b>
                </h5>
                <h6 class="card-subtitle mb-2 text-muted">
                  <span class="card-text">{{
                    weather && weather.data
                      ? `Min.: ${Math.round(weather.data.main.temp_min)} °C`
                      : ""
                  }}</span>
                  <span class="card-text">{{
                    weather && weather.data
                      ? `Max.: ${Math.round(weather.data.main.temp_max)} °C`
                      : ""
                  }}</span>
                </h6>
                <h5 class="card-text">
                  {{
                    weather && weather.data
                      ? `Temp feel: ${Math.round(
                          weather.data.main.feels_like
                        )} °C`
                      : ""
                  }}
                </h5>
              </div>
            </div>
            <!--            Weather / Wind card-->
            <div class="card shadow p-3 mb-5 bg-white" style="width: 18rem">
              <div class="card-body">
                <h5 class="card-title">
                  <b class="text-primary">{{
                    weather && weather.data
                      ? `${weather.data.weather[0].main}`
                      : ""
                  }}</b>
                  <img
                    class="weather-img"
                    :src="getWeatherIcon"
                    alt="weather_icon"
                    style="top: 0"
                    width="75"
                  />
                </h5>
                <h6 class="card-subtitle mb-2 text-muted">
                  {{
                    weather && weather.data
                      ? `${weather.data.weather[0].description}`
                      : ""
                  }}
                </h6>
                <h5 class="card-text">
                  {{
                    weather && weather.data
                      ? `Wind speed: ${Math.round(weather.data.wind.speed)} m/s`
                      : ""
                  }}
                </h5>
              </div>
            </div>
            <!--          Humidity card  -->
            <div class="card shadow p-3 mb-5 bg-white">
              <div class="card-body humidity-card">
                <h5 class="card-title"><b>Humidity</b></h5>
                <!--                SVG circles as indicator of humidity percentage-->
                <svg id="svg" width="100" height="100">
                  <circle cx="50" cy="50" r="45" fill="#fff" />
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-width="5"
                    stroke="#ddd"
                    d="M50 10
           a 40 40 0 0 1 0 80
           a 40 40 0 0 1 0 -80"
                  />
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-width="5"
                    stroke="#007BFF"
                    :stroke-dasharray="progress"
                    d="M50 10
           a 40 40 0 0 1 0 80
           a 40 40 0 0 1 0 -80"
                  />
                  <text
                    x="50"
                    y="50"
                    text-anchor="middle"
                    dy="7"
                    font-size="20"
                    fill="#007BFF"
                  >
                    {{ weather.data.main.humidity }}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Axios from "axios";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import * as Interface from "../interface";
import store from "../store";

const Weather = Vue.extend({
  data() {
    return {
      weather_api_key: "84074fa88701989e721ba5f79a70ebb8",
      google_api_key: "AIzaSyBYdvYxW7JWQ5yQI6Ct6JA5Qkz1IBsFO4Q",
      url_base: `https://api.openweathermap.org/data/2.5/weather`,
      city_input: "",
      weather: {} as Interface.RootWeather,
      curr_date: moment().format("DD.MM.YYYY"),
    };
  },
  computed: {
    // count the length of "progress bar" for humidity
    progress(): string {
      return `${(251.2 / 100) * this.weather.data.main.humidity},
        ${(251.2 / 100) * (100 - this.weather.data.main.humidity)}`;
    },
    // take icon name from weather data
    getWeatherIcon(): string {
      return `http://openweathermap.org/img/wn/${this.weather.data.weather[0].icon}.png`;
    },
    connected(): boolean {
      return this.$store.getters["connected"];
    },
  },
  methods: {
    async getLocation(e: Event) {
      //if this method is not called on click, exit
      if (e.type !== "click") return;

      navigator.geolocation.getCurrentPosition(
        async (coordinates) => {
          const { latitude, longitude } = coordinates.coords;
          //from coordinates to name of a city
          this.city_input = await this.getCityFromCoordinates(
            latitude,
            longitude
          );
          //once city is set, fetch weather data
          await this.fetchWeather(e);
        },
        (err) => {
          this.showToast(
            `Coudn't show any data because: ${err.message}`,
            "error"
          );
          console.error("Error in geolocation!", err);
        }
      );
    },
    async fetchWeather(e: Event): Promise<void> {
      if (e.type !== "click") return;
      //if not online, show toast and exit
      if (!navigator.onLine) {
        this.showToast(
          `Coudn't show any data because: no internet connection`,
          "error"
        );
        return;
      }
      //if nothing in input, show toast and exit
      if (this.city_input.length < 1) {
        this.showToast("Please, insert city name", "warning");
        return;
      }
      Axios.get(
        `${this.url_base}?q=${this.city_input}&units=metric&APPID=${this.weather_api_key}`
      ) //fixme: type
        .then((res: any) => {
          this.weather = res;
        })
        .catch((err) => {
          this.showToast(
            `Coudn't show any data because: ${err.response.data.message}`,
            "error"
          );
          console.log(err);
        });
    },
    async getCityFromCoordinates(
      latitude: number,
      longitude: number
    ): Promise<string> {
      return (
        Axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.google_api_key}`
        )
          //addresses in result are less detailed in each item of array. 8th object gives only name of a city and country
          .then((res) => res.data.results[7].formatted_address)
          .catch((err) => console.error("Cannot get city", err)) //error msg is in callback getLocation
      );
    },
    //set empty input on button click and set empty weather, so cards will hide
    clearInput() {
      this.city_input = "";
      this.weather = {} as Interface.RootWeather;
    },
    //to improve: module would be better
    showToast(
      message: string,
      type: "success" | "info" | "warning" | "error" | "default"
    ) {
      Vue.$toast.open({
        message,
        position: "bottom",
        type,
        dismissible: true,
        queue: true,
        pauseOnHover: true,
      });
    },
  },
  created(): void {
    window.addEventListener("offline", () => {
      this.showToast("You've gone offline!", "error");
      store.dispatch("setConnected", false);
    });
    window.addEventListener("online", () => {
      this.showToast("You are online again", "info");
      store.dispatch("setConnected", true);
    });
    return;
  },
});

export default Weather;
</script>

<style>
/* todo: SASS would be better - nesting */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat", serif;
}

.clear-text {
  background: #fff;
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  bottom: 0;
  cursor: pointer;
}

.clear-text:after {
  content: "";
  height: 1.5rem;
  border-left: 4px solid #007bff;
  border-radius: 2px;
  position: absolute;
  transform: rotate(45deg);
  left: -15px;
  bottom: 0;
}

.clear-text:before {
  content: "";
  height: 1.5rem;
  border-left: 4px solid #007bff;
  border-radius: 2px;
  position: absolute;
  transform: rotate(-45deg);
  left: -15px;
  bottom: 0;
}

.weather-img {
  position: absolute;
  top: 1rem !important;
  right: 1rem;
}

.pin {
  position: relative;
  bottom: 0.5rem;
}

.btn-primary {
  margin-left: 1rem;
}

.input-wrap {
  margin-bottom: 30px;
  margin-left: 5rem;
}

input {
  min-height: 38px;
  border-width: 0;
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
}

.h1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 5rem;
}

.card-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-left: 5rem;
}

.card {
  text-align: left;
  height: 12rem;
  width: 18rem;
  margin-right: 2rem;
  justify-content: center;
  border: none !important;
  border-radius: 1rem !important;
}

.card-body {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

span {
  margin-right: 2rem;
}

.humidity-card {
  flex-direction: row !important;
  align-items: center !important;
  display: flex;
}
</style>
