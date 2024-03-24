import React, { Component } from "react";
import UpArrow from "../assets/svg/upward.svg";
import FacebookW from "../assets/svg/facebookwhite.svg";
import YoutubeW from "../assets/svg/youtubewhite.svg";
import InstaW from "../assets/svg/instagramwhite.svg";
import PhoneG from "../assets/svg/telephonegrey.svg";
import MailG from "../assets/svg/mailgrey.svg";
import GlobeG from "../assets/svg/worldgrey.svg";
import LocationG from "../assets/svg/pinGrey.svg";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default class Footer extends Component {
  state = {
    currentLocation: null,
    latitude: 21.140702788740864,
    longitude: 72.81054341539953,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setState({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    const { latitude, longitude } = this.state;
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="text-lg font-bold mb-4">Zorko</h2>
              <p className="mb-4">
                Be a Part of India's Fastest Growing Pure Vegetarian Affordable
                Franchise Chain.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/ZorkoBrand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src={FacebookW} alt="Facebook" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@ZORKOBRAND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src={YoutubeW} alt="Youtube" className="w-6 h-6" />
                </a>
                <a
                  href="https://zorko.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300"
                >
                  <img src={InstaW} alt="Instagram" className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="h-48">
              <h2 className="text-lg font-bold mb-4">Location</h2>
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}></Marker>
              </MapContainer>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Contact Info</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <img
                    src={LocationG}
                    alt="Location"
                    className="w-4 h-4 mr-2"
                  />
                  Shop No.310-311, 3rd Floor, Exult Shoppers, near, Vesu Main
                  Road, nr. Siddhi vinayak Temple, Vesu, Surat, Gujarat 395007
                </li>
                <li className="flex items-center">
                  <img src={PhoneG} alt="Phone" className="w-4 h-4 mr-2" />
                  099099 00139
                </li>
                <li className="flex items-center">
                  <img src={MailG} alt="Mail" className="w-4 h-4 mr-2" />
                  franchise@zorko.in
                </li>
                <li className="flex items-center">
                  <img src={GlobeG} alt="Website" className="w-4 h-4 mr-2" />
                  <a
                    href="https://zorko.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300"
                  >
                    https://zorko.in/
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center mt-8">
            <div
              className="cursor-pointer hover:text-gray-300"
              onClick={this.scrollToTop}
            >
              <img src={UpArrow} alt="Scroll to Top" className="w-6 h-6" />
            </div>
            <div className="text-sm">&copy; Zorko-24</div>
          </div>
        </div>
      </footer>
    );
  }
}
