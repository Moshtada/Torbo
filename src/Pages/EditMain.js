import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditMain = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const product = location.state?.product;
    const [updatedProduct, setUpdatedProduct] = useState(product);

    if (!updatedProduct || !updatedProduct.mainOptions) {
        return <p>Loading...</p>;
    }

    // تابع برای تغییر ورودی‌ها
    const handleInputChange = (e, key, parentKey, subKey, subSubKey) => {
        if (subSubKey !== undefined) {
            const updatedSubSubOptions = [...updatedProduct.mainOptions[parentKey].subOptions[subKey].subSubOptions];
            updatedSubSubOptions[subSubKey].name = e.target.value;
            const updatedSubOptions = [...updatedProduct.mainOptions[parentKey].subOptions];
            updatedSubOptions[subKey].subSubOptions = updatedSubSubOptions;
            const updatedMainOptions = [...updatedProduct.mainOptions];
            updatedMainOptions[parentKey].subOptions = updatedSubOptions;
            setUpdatedProduct({ ...updatedProduct, mainOptions: updatedMainOptions });
        } else if (subKey !== undefined) {
            const updatedSubOptions = [...updatedProduct.mainOptions[parentKey].subOptions];
            updatedSubOptions[subKey].name = e.target.value;
            const updatedMainOptions = [...updatedProduct.mainOptions];
            updatedMainOptions[parentKey].subOptions = updatedSubOptions;
            setUpdatedProduct({ ...updatedProduct, mainOptions: updatedMainOptions });
        } else {
            setUpdatedProduct({ ...updatedProduct, [key]: e.target.value });
        }
    };

    // تابع برای اضافه کردن گزینه‌ها
    const handleAddOption = (level, parentIdx, subIdx) => {
        const newProduct = { ...updatedProduct };
        if (level === "main") {
            const newMainOption = {
                id: newProduct.mainOptions.length + 1,
                name: `New Main Option ${newProduct.mainOptions.length + 1}`,
                subOptions: [],
            };
            newProduct.mainOptions.push(newMainOption);
        } else if (level === "sub") {
            const newSubOption = {
                id: newProduct.mainOptions[parentIdx].subOptions.length + 1,
                name: `New Sub Option ${newProduct.mainOptions[parentIdx].subOptions.length + 1}`,
                subSubOptions: [],
            };
            newProduct.mainOptions[parentIdx].subOptions.push(newSubOption);
        } else if (level === "subSub") {
            const newSubSubOption = {
                id: newProduct.mainOptions[parentIdx].subOptions[subIdx].subSubOptions.length + 1,
                name: `New Sub Sub Option ${newProduct.mainOptions[parentIdx].subOptions[subIdx].subSubOptions.length + 1}`,
            };
            newProduct.mainOptions[parentIdx].subOptions[subIdx].subSubOptions.push(newSubSubOption);
        }
        setUpdatedProduct(newProduct);
    };

    // ذخیره تغییرات
    const handleSave = () => {
        fetch(`http://localhost:3005/products/${updatedProduct.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update product");
                }
                return response.json();
            })
            .then(() => {
                console.log("Product updated successfully!");
                navigate("/"); // بازگشت به لیست محصولات
            })
            .catch((err) => console.error(err.message));
    };

    return (
        <div>
            <h2>Edit Product</h2>
            <form>
                {updatedProduct.mainOptions.map((mainOption, mainIdx) => (
                    <div key={mainIdx} className="mb-3">
                        <label className="form-label">Main Option {mainOption.id}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={mainOption.name}
                            onChange={(e) => handleInputChange(e, "name", mainIdx)}
                        />
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => handleAddOption("sub", mainIdx)}
                        >
                            + Add Sub Option
                        </button>
                        {mainOption.subOptions.map((subOption, subIdx) => (
                            <div key={subIdx} className="ms-4 mb-3">
                                <label className="form-label">Sub Option {subOption.id}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={subOption.name}
                                    onChange={(e) => handleInputChange(e, "name", mainIdx, subIdx)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleAddOption("subSub", mainIdx, subIdx)}
                                >
                                    + Add Sub Sub Option
                                </button>
                                {subOption.subSubOptions.map((subSubOption, subSubIdx) => (
                                    <div key={subSubIdx} className="ms-4 mb-3">
                                        <label className="form-label">Sub Sub Option {subSubOption.id}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={subSubOption.name}
                                            onChange={(e) =>
                                                handleInputChange(e, "name", mainIdx, subIdx, subSubIdx)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
                {/* <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleAddOption("main")}
                >
                    + Add Main Option
                </button> */}
            </form>
            <button onClick={handleSave} className="btn btn-primary mt-3">
                Save Changes
            </button>
        </div>
    );
};

export default EditMain;
