import React, { useState, useEffect } from "react";
import "./RideOnWay.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";

import success from "../../assets/success.png"
import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import SLIDER from "../../assets/SLIDER.png"

import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import PhoneNumber from "../../assets/phonenumber.png";
import Username from "../../assets/username.png";
import { ScrollToTopButton } from "../ScrollToTopButton/ScrollToTopButton";

const RideOnWay = () => {
    const navigate = useNavigate();
    const location = useLocation();

    /* ================= STATE ================= */
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");

    const [fare, setFare] = useState("");
    const [showSummary, setShowSummary] = useState(false);
    const [showViewDetail, setShowViewDetail] = useState(false);

    const [activeInput, setActiveInput] = useState(null);
    const [pickupPredictions, setPickupPredictions] = useState([]);
    const [dropPredictions, setDropPredictions] = useState([]);

    const [phoneType, setPhoneType] = useState("receiver");
    const [nameType, setNameType] = useState("receiver");

    const [showCancelPopup, setShowCancelPopup] = useState(false);


    /* ================= VEHICLES ================= */
    const vehicleData = {
        "2 Wheeler.": { img: TwoWheeler, weight: "18kg.", price: "140", name: "bike" },
        "Mini Auto.": { img: MiniAuto, weight: "45kg.", price: "180", name: "miniAuto" },
        "E Loader.": { img: Eloader, weight: "400kg.", price: "260", name: "ELoader" },
        "3 Wheeler.": { img: ThreeWheeler, weight: "550kg.", price: "350", name: "threeWheeler" },
        "Mini Truck.": { img: MiniTruck, weight: "720kg.", price: "520", name: "miniTruck" },
    };

    const tabs = Object.keys(vehicleData);
    const [activeTab, setActiveTab] = useState("2 Wheeler.");
    const selected = vehicleData[activeTab];

    /* ================= AUTO VEHICLE FROM FOOTER ================= */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (location.state?.vehicle) {
            const map = {
                "2-wheeler": "2 Wheeler.",
                "mini-auto": "Mini Auto.",
                "e-loader": "E Loader.",
                "3-wheeler": "3 Wheeler.",
                "mini-truck": "Mini Truck.",
            };
            setActiveTab(map[location.state.vehicle] || "2 Wheeler.");
        }
    }, [location.state]);

    /* ================= PLACE SUGGESTIONS ================= */
    useEffect(() => {
        let query = "";
        let setter = null;

        if (activeInput === "pickup") {
            query = pickup;
            setter = setPickupPredictions;
        }
        if (activeInput === "drop") {
            query = drop;
            setter = setDropPredictions;
        }

        if (!query) return;

        axios
            .get("https://thetest-h9x3.onrender.com/maps/getSuggestion", {
                params: { input: query },
            })
            .then((res) => setter(res.data.results || []))
            .catch(console.error);
    }, [pickup, drop, activeInput]);

    const handleSelectPrediction = (item) => {
        if (activeInput === "pickup") {
            setPickup(item.formatted_address);
            setPickupPredictions([]);
        }
        if (activeInput === "drop") {
            setDrop(item.formatted_address);
            setDropPredictions([]);
        }
        setActiveInput(null);
    };

    /* ================= GET FARE ================= */
    const handleSubmit = async () => {
        try {
            const res = await axios.get(
                "https://thetest-h9x3.onrender.com/maps/get-fair-estimate",
                {
                    params: {
                        origin: pickup,
                        destination: drop,
                        vehicle: selected.name,
                    },
                }
            );

            if (res.data?.fare) {
                setFare(res.data.fare);
                setShowSummary(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= EDIT ================= */
    const handleEditPrice = () => {
        setShowSummary(false);
        setShowViewDetail(false);
        setFare("");
    };

    /* ================= BOOK RIDE ================= */
    const handleRequestedRide = async () => {
        const userPhone = localStorage.getItem("phone");
        if (!userPhone) {
            alert("Please Login");
            navigate("/user-login");
            return;
        }

        try {
            const payload = {
                name,
                phone,
                pickup,
                drop,
                userPhone,
                fare,
                vehcile: selected.name,
            };

            const res = await axios.post(
                "https://thetest-h9x3.onrender.com/ride/createRide",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.success) {
                localStorage.setItem("ride", JSON.stringify(res.data.data));
                navigate("/search/ride");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isFormFilled = pickup && drop && phone && name;
    return (
        <>
            <Navbar />
            <div className="fare-container">
                <div className="fare-body">
                    {/* LEFT CARD */}
                    <div className="fare-card" id="fare-card">
                        <div className="fare-trip">
                            <p>Trip Id.</p>
                            <p>CRN1238650422</p>
                        </div>
                        {/* VEHICLE IMAGE */}
                        <div className="fare-top">
                            <img src={selected.img} alt="vehicle" />
                        </div>

                        <div className="fare-detail">
                            {/* ADDRESS SUMMARY */}
                            <div className="address-box">
                                <p className="address-title">Address Details</p>

                                {/* PICKUP */}
                                <div className="address-item">
                                    <span className="dot green"></span>
                                    <div className="address-content">
                                        <p className="label">Pickup Location</p>
                                        <p className="value">
                                            {pickup || "Pickup location not selected"}
                                            <img
                                                src={success}
                                                alt="success"
                                                className="pickup-success-icon"
                                            />
                                        </p>
                                    </div>
                                </div>

                                <div className="address-line"></div>

                                {/* DROP */}
                                <div className="address-item">
                                    <span className="dot red"></span>
                                    <div className="address-content">
                                        <p className="label">
                                            Drop Location
                                            <span className="name">
                                                {" "}• {name || "Name not added"}
                                            </span>
                                            <span className="mid-dot"> • </span>
                                            <span className="phone">
                                                {phone || "Phone not added"}
                                            </span>
                                        </p>
                                        <p className="value">
                                            {drop || "Drop location not selected"}
                                            <span className="route-dot red"></span>
                                            <span className="route-dot red"></span>
                                            <span className="route-dot red"></span>
                                            <span className="route-dot red"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* VEHICLE NAME */}
                            <h3>{activeTab}</h3>

                            {/* PRICE */}
                            <h4>{fare ? `₹${fare}/-` : `₹${selected.price}/-`}</h4>

                            {/* EDIT & VIEW DETAIL */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>

                                <p
                                    id="ride-detail"
                                    onClick={() => setShowViewDetail(true)}
                                >
                                    View Detail
                                </p>

                                <p
                                    id="price-cancel"
                                    className="cancel-trip"
                                    onClick={() => setShowCancelPopup(true)}
                                >
                                    Cancel Trip
                                </p>
                                {showCancelPopup && (
                                    <div className="cancel-popup-overlay">
                                        <div className="cancel-popup">

                                            <span
                                                className="popup-close"
                                                onClick={() => setShowCancelPopup(false)}
                                            >
                                                ✕
                                            </span>

                                            <h2>HEY, WAIT!</h2>
                                            <p>Are you sure you want to cancel your order?</p>

                                            <div className="popup-actions">
                                                <button
                                                    className="popup-btn cancel"
                                                    onClick={() => {
                                                        setShowCancelPopup(false);
                                                        setShowSummary(false);
                                                        setFare("");
                                                        navigate("/fare-link");
                                                    }}
                                                >
                                                    CANCEL TRIP
                                                </button>

                                                <button
                                                    className="popup-btn save"
                                                    onClick={() => setShowCancelPopup(false)}
                                                >
                                                    SAVE TRIP
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* VIEW DETAIL MODAL */}
                            {showViewDetail && (
                                <div className="view-detail-overlay">
                                    <div className="view-detail-modal">

                                        <span
                                            className="view-detail-close"
                                            onClick={() => setShowViewDetail(false)}
                                        >
                                            ✕
                                        </span>

                                        <div className="view-detail-body">

                                            {/* LEFT */}
                                            <div className="view-left">
                                                <img src={selected.img} alt="vehicle" />
                                                <h4>{activeTab}</h4>
                                                <h2>₹{fare || selected.price}/-</h2>
                                            </div>

                                            <div className="view-divider"></div>

                                            {/* RIGHT */}
                                            <div className="view-right">
                                                <h3>View Detail</h3>

                                                <div className="info-block">
                                                    <h5>Pickup Location</h5>
                                                    <p>
                                                        <img src={GreenCircle} alt="" />
                                                        <span className="text">{pickup}</span>
                                                    </p>
                                                </div>

                                                <div className="info-block">
                                                    <h5>Drop Location</h5>
                                                    <p>
                                                        <img src={Drop} alt="" />
                                                        <span className="text">{drop}</span>
                                                    </p>
                                                </div>

                                                <div className="info-block meta-row">
                                                    <p>
                                                        <img src={PhoneNumber} alt="" />
                                                        <span className="text">+91 {phone}</span>
                                                    </p>
                                                    <span className="meta-label receiver">Receiver</span>
                                                </div>

                                                <div className="info-block meta-row">
                                                    <p>
                                                        <img src={Username} alt="" />
                                                        <span className="text">{name}</span>
                                                    </p>
                                                    <span className="meta-label receiver">Receiver</span>
                                                </div>

                                                <button
                                                    className="view-book-btn"
                                                    onClick={handleRequestedRide}
                                                >
                                                    BOOK NOW
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    <div class="rideon-divider"></div>

                    <div className="ride-right">
                        <div className="right-text">
                            <h2>DRIVER ON THE WAY <br /> TO PICKUP.</h2>
                            <p>Finding Driver near you.</p>
                        </div>
                        <div className="ride-map">
                            <img src={SLIDER} alt="" />
                        </div>
                        <div className="driver-card">
                            {/* LEFT */}
                            <div className="driver-left">
                                <img
                                    src={Username}
                                    alt="driver"
                                    className="driver-avatar"
                                />

                                <div className="driver-info">
                                    <h2 className="vehicle-number">UP32KZ2366</h2>
                                    <p className="call-driver">Call Driver - 8177000316</p>

                                    <div className="driver-name">
                                        <strong>Bader</strong>
                                        <span>View</span>
                                    </div>
                                </div>
                            </div>

                            {/* DIVIDER */}
                            <div className="driver-divider"></div>

                            {/* RIGHT */}
                            <div className="driver-right">
                                <div className="ride-status-row">
                                    <p className="ride-type">
                                        2 Wheeler - <span className="green">05 min</span> ( 2 km )
                                    </p>
                                </div>

                                <p className="coming-text">Coming soon wait for while</p>

                                <div className="progress-bar-wrapper">
                                    <div className="progress-active"></div>
                                </div>
                            </div>
                                    <div className="ride-share">
                                    <img
                                        src={"https://cdn-icons-png.flaticon.com/512/929/929468.png"}
                                        alt="share"
                                        className="share-icon"
                                        />
                                        <p>Share</p>
                                        </div>
                        </div>

                    </div>

                </div>
            </div>
            <Footer />
            <ScrollToTopButton />
        </>
    )
}

export default RideOnWay
