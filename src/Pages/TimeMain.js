import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment-jalaali";

const TimeMain = () => {
    const location = useLocation();
    const productId = location.state?.productId;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (productId) {
            fetch(`http://localhost:3005/products/${productId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch product data");
                    }
                    return response.json();
                })
                .then((data) => setProduct(data))
                .catch((error) => console.error("Error fetching product data:", error));
        }
    }, [productId]);

    // تبدیل تاریخ شمسی
    const formatJalaliDate = (date) => {
        if (!date) return "-";
        return moment(date, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD");
    };

    // محاسبه درصد پیشرفت
    const calculateProgress = (startDate, endDate) => {
        const today = moment(); // تاریخ امروز
        const start = moment(startDate, "jYYYY/jMM/jDD");
        const end = moment(endDate, "jYYYY/jMM/jDD");

        if (!start.isValid() || !end.isValid()) return 0;

        const totalDuration = end.diff(start, "days");
        const elapsedDuration = today.diff(start, "days");

        return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
    };

    if (!product) {
        return <p>Loading product data...</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Product Details with Progress</h2>
            <p>
                <strong>Product ID:</strong> {product.productId}
            </p>
            <p>
                <strong>Product Name:</strong> {product.productName}
            </p>

            <h3>Main Options</h3>
            {product.mainOptions && product.mainOptions.length > 0 ? (
                product.mainOptions.map((mainOption, mainIdx) => {
                    const mainProgress = calculateProgress(mainOption.startDate, mainOption.endDate);
                    return (
                        <div key={mainIdx} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
                            <p>
                                <strong>Main Option Name:</strong> {mainOption.name}
                            </p>
                            <p>
                                <strong>Start Date (شمسی):</strong> {formatJalaliDate(mainOption.startDate)}
                            </p>
                            <p>
                                <strong>End Date (شمسی):</strong> {formatJalaliDate(mainOption.endDate)}
                            </p>
                            <p>
                                <strong>Progress:</strong> {mainProgress.toFixed(2)}%
                            </p>
                            <div
                                style={{
                                    background: "#e0e0e0",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    height: "20px",
                                    marginBottom: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${mainProgress}%`,
                                        background: "#76c7c0",
                                        height: "100%",
                                        transition: "width 0.3s ease",
                                    }}
                                ></div>
                            </div>

                            {mainOption.subOptions && mainOption.subOptions.length > 0 && (
                                <>
                                    <h4>Sub Options</h4>
                                    {mainOption.subOptions.map((subOption, subIdx) => {
                                        const subProgress = calculateProgress(subOption.startDate, subOption.endDate);
                                        return (
                                            <div
                                                key={subIdx}
                                                style={{
                                                    marginLeft: "20px",
                                                    marginBottom: "10px",
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                <p>
                                                    <strong>Sub Option Name:</strong> {subOption.name}
                                                </p>
                                                <p>
                                                    <strong>Start Date (شمسی):</strong> {formatJalaliDate(subOption.startDate)}
                                                </p>
                                                <p>
                                                    <strong>End Date (شمسی):</strong> {formatJalaliDate(subOption.endDate)}
                                                </p>
                                                <p>
                                                    <strong>Progress:</strong> {subProgress.toFixed(2)}%
                                                </p>
                                                <div
                                                    style={{
                                                        background: "#e0e0e0",
                                                        borderRadius: "10px",
                                                        overflow: "hidden",
                                                        height: "20px",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: `${subProgress}%`,
                                                            background: "#76c7c0",
                                                            height: "100%",
                                                            transition: "width 0.3s ease",
                                                        }}
                                                    ></div>
                                                </div>

                                                {subOption.subSubOptions && subOption.subSubOptions.length > 0 && (
                                                    <>
                                                        <h5>Sub-Sub Options</h5>
                                                        {subOption.subSubOptions.map((subSubOption, subSubIdx) => {
                                                            const subSubProgress = calculateProgress(
                                                                subSubOption.startDate,
                                                                subSubOption.endDate
                                                            );
                                                            return (
                                                                <div
                                                                    key={subSubIdx}
                                                                    style={{
                                                                        marginLeft: "40px",
                                                                        marginBottom: "10px",
                                                                        padding: "10px",
                                                                        border: "1px solid #eee",
                                                                    }}
                                                                >
                                                                    <p>
                                                                        <strong>Sub-Sub Option Name:</strong> {subSubOption.name}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Start Date (شمسی):</strong>{" "}
                                                                        {formatJalaliDate(subSubOption.startDate)}
                                                                    </p>
                                                                    <p>
                                                                        <strong>End Date (شمسی):</strong>{" "}
                                                                        {formatJalaliDate(subSubOption.endDate)}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Progress:</strong>{" "}
                                                                        {subSubProgress.toFixed(2)}%
                                                                    </p>
                                                                    <div
                                                                        style={{
                                                                            background: "#e0e0e0",
                                                                            borderRadius: "10px",
                                                                            overflow: "hidden",
                                                                            height: "20px",
                                                                            marginBottom: "10px",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                width: `${subSubProgress}%`,
                                                                                background: "#76c7c0",
                                                                                height: "100%",
                                                                                transition: "width 0.3s ease",
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>No main options available.</p>
            )}
        </div>
    );
};

export default TimeMain;
