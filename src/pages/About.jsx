import React, { Component } from "react";
import img from "../assets/zorkoAbout.jpeg";
import "./About.css";

export default class Aboutus extends Component {
  render() {
    return (
      <div className="about">
        <div className="founderSec">
          <div className="innerFs">
            <p className="messageFc">
              India's Fastest Growing Pure Vegetarian Affordable Franchise Chain
            </p>
            <div className="profileSecFc">Our Founder</div>
            <div className="signatureFc">Anand Nahar & Amrit Nahar</div>
          </div>
        </div>
        <div className="ourStorySec">
          <div className="innerOss">
            <div className="imageSecSs">
              <a href="#0">
                <img src={img} alt="" />
              </a>
            </div>
            <div className="detailsSs">
              <div className="innerDetailsSs">
                <div className="headerIdss">discover</div>
                <div className="titleIdss">our story</div>
                <div className="mainIdss">
                  ultimate dining experience like no other
                </div>
                <div className="messageIdss">
                  ZORKO is an inspirational Entrepreneurial journey of Nahar
                  Brothers ( Anand Nahar and Amrit Nahar) who dared to dream and
                  execute big during the COVID-19 Pandemic time. When Youths of
                  their age were busy doing Netflix and chill during the
                  lockdown, Nahar brothers decided to utilize this time for a
                  noble cause that touched more than 1 million lives. Both the
                  brothers are engineering graduate with no formal education in
                  business. Anand Nahar is also a SEBI Registered ® Research
                  Analyst while Amrit Nahar has done his masters in
                  Anthropology. There are only 760 such Registered ® Analyst in
                  India 🇮🇳 .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
