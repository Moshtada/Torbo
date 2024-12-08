import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom'

export  function Products(mainOption) {

    
    const [content, setContent] = useState(<ProductList showForm={showForm}/>)

    function showList() {
        setContent(<ProductList showForm={showForm} />)
    }

    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList} />)
    }

  return (
    <div className="container my-5">
        {content}
    </div>
  )
}


function ProductList(props) {
    const[products, setProducts] = useState([])

    const navigate = useNavigate()

    function fetchProducts() {
    
        fetch("http://localhost:3005/products")
        .then((response) =>{
            if (!response.ok) {
                throw new Error("Unexpected Server Response"); 
            }
            return response.json()
        })
        .then((data) => {
            //console.log(json);
            setProducts(data)
        })
        .catch ((error) => console.log(error.message))
        
    }
    //fetchProducts()

    useEffect(() => fetchProducts(), []);

    function deleteProduct(id) {
        fetch("http://localhost:3005/products/" + id,{
            method: "DELETE"
        })
            .then((response) =>  response.json())
            .then((data)=> fetchProducts())
    }

    const handleEdit = (product) => {
        navigate(`/editmain?productId=${product.id}`, { state: { product } });
    };
    

    const handleDraw = (productId) => {
        // const product = products.find((prod) => prod.id === productId); // پیدا کردن محصول بر اساس id
        navigate(`/drawmain?productId=${productId}`, { state: { productId } }); // ارسال اطلاعات محصول به صفحه Draw
    };
    
    const handleTime = (productId) => {
        navigate(`/timemain?productId=${productId}`, { state: { productId } }); // ارسال اطلاعات محصول به صفحه Draw
    };

    return(
        <>
            <h2 className="text-center mb-3">List of Products</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Create</button>
            <button onClick={() => fetchProducts()} type="button" className="btn btn-outline-primary me-2">Refresh</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        {/* <th>Brand</th> */}
                        {/* <th>Category</th> */}
                        {/* <th>Price</th> */}
                        {/* <th>Created At</th> */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return(
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    {/* <td>{product.mainOption}</td> */}
                                    <td>{product.mainOptions && product.mainOptions.map((option, idx) => (
                                        <div key={idx}>{option.name}</div>
                                    ))}</td>
                                    {/* <td>{product.brand}</td> */}
                                    {/* <td>{product.category}</td> */}
                                    {/* <td>{product.price}</td> */}
                                    {/* <td>{product.createdAt}</td> */}
                                    <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                        <button onClick={() => handleTime(product.id)} type="button" className="btn btn-warning btn-sm me-2">Time</button>
                                        <button onClick={() => handleDraw(product.id)} type="button" className="btn btn-success btn-sm me-2">Draw</button>
                                        <button onClick={()=> handleEdit(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                        <button onClick={()=> deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                                    </td>

                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default ProductList

export function ProductForm(props) {
    const[errorMessage, setErrorMessage] = useState("")
    
    useEffect(() => {
        if (props.product?.id) {
            // اگر یک محصول برای ویرایش وجود داشته باشد، مقادیر آن را به state اختصاص بدهید
            console.log("Fetched product:", props.product); // اضافه کردن برای تست
            setProduct({
                name: props.product.name || '',
                startDate: props.product.startDate || '',
                endDate: props.product.endDate || '',
                mainOptions: props.product.mainOptions || [],
                subOptions: props.product.subOptions || {},
                subSubOptions: props.product.subSubOptions || {}
            });
            setMainOptions(props.product.mainOptions || []);
            setSubOptions(props.product.subOptions || {});
            if (props.product.subOptions) {
                const updatedSubOptions = Object.keys(props.product.subOptions).reduce((acc, key) => {
                    acc[key] = props.product.subOptions[key]; // می‌توانید تغییرات مورد نظر را انجام دهید
                    return acc;
                }, {});
                setSubOptions(updatedSubOptions);
            }
        }
    }, [props.product]);
    
    // const [startBrand, setStartBrand] = useState('');
    // const [endBrand, setEndBrand] = useState('');
    // const [startName, setStartName] = useState('');
    // const [endName, setEndName] = useState('');
    
    
    const [mainOptions, setMainOptions] = useState([]); // لیست گزینه‌های اصلی
    const [newMainOption, setNewMainOption] = useState(''); // نام گزینه اصلی جدید
    const [newMainStartDate, setNewMainStartDate] = useState(''); // تاریخ شروع گزینه اصلی
    const [newMainEndDate, setNewMainEndDate] = useState(''); // تاریخ پایان گزینه اصلی
    
    const [selectedMainOption, setSelectedMainOption] = useState(''); // گزینه اصلی انتخاب شده برای زیر گزینه‌ها
    const [newSubOption, setNewSubOption] = useState(''); // نام زیر گزینه جدید
    const [subOptions, setSubOptions] = useState([]); // ذخیره زیر گزینه‌ها برای هر گزینه اصلی
    const [newSubStartDate, setNewSubStartDate] = useState(''); // تاریخ شروع زیر گزینه
    const [newSubEndDate, setNewSubEndDate] = useState(''); // تاریخ پایان زیر گزینه
    
    const [selectedSubOption, setSelectedSubOption] = useState(''); // زیر گزینه انتخاب شده برای زیر زیر گزینه‌ها
    const [newSubSubOption, setNewSubSubOption] = useState(''); // نام زیر زیر گزینه جدید
    const [newSubSubStartDate, setNewSubSubStartDate] = useState(''); // تاریخ شروع زیر زیر گزینه
    const [newSubSubEndDate, setNewSubSubEndDate] = useState(''); // تاریخ پایان زیر زیر گزینه

    const [subSubOptions, setSubSubOptions] = useState([]); // مدیریت زیر زیر گزینه‌ها

    
    const [product , setProduct] = useState({
        name:'',
        startDate:'',
        endDate:'',
        mainOptions: [],
        subOptions: {},
        newSubSubOptions: {}

    })
    
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    
    //     // خواندن داده‌های فرم
    //     const formData = new FormData(event.target);
        
    //     // تبدیل FormData به شیء
    //     const product = Object.fromEntries(formData.entries());
    
    //     // اضافه کردن داده‌های گزینه‌ها به شیء product
    //     product.mainOptions = mainOptions; // اضافه کردن گزینه‌های اصلی
    //     product.subOptions = Object.values(subOptions).flat; // اضافه کردن زیر گزینه‌ها
    
    //     console.log("product Data:", product)

        
    //     // اعتبارسنجی فرم
    //     // if (!product.name) {
    //     //     console.log("Please provide all the required fields!");
    //     //     setErrorMessage(
    //     //         <div className="alert alert-warning" role="alert">
    //     //             Please provide all the required fields!
    //     //         </div>
    //     //     );
    //     //     return;
    //     // }
    
    //     // ارسال درخواست به سرور
    //     if (props.product.id) {
    //         // به‌روزرسانی محصول موجود
    //         fetch("http://localhost:3005/products/" + props.product.id, {
    //             method: "PATCH",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(product),
    //         })
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     throw new Error("Unexpected Server Response");
    //                 }
    //                 return response.json();
    //             })
    //             .then((data) => props.showList())
    //             .catch((error) => console.log(error.message));
    //     } else {
    //         // ایجاد محصول جدید
    //         product.createdAt = new Date().toISOString().slice(0, 10);
    //         fetch("http://localhost:3005/products", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(product),
    //         })
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     throw new Error("Unexpected Server Response");
    //                 }
    //                 return response.json();
    //             })
    //             .then((data) => props.showList())
    //             .catch((error) => console.log(error.message));
    //     }
    // };
    

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // خواندن داده‌های فرم
        const formData = new FormData(event.target);
    
        // تبدیل FormData به شیء
        const product = Object.fromEntries(formData.entries());
    
        // اضافه کردن داده‌های گزینه‌ها به شیء product
        product.mainOptions = mainOptions.map(option => ({
            ...option,
            subOptions: subOptions[option.name]?.map(subOption => ({
                ...subOption,
                subSubOptions: subOption.subSubOptions || []
            })) || []
        }));
    
        console.log("product Data:", product);
    
        // ارسال درخواست به سرور
        if (props.product.id) {
            // به‌روزرسانی محصول موجود
            fetch("http://localhost:3005/products/" + props.product.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Unexpected Server Response");
                }
                return response.json();
            })
            .then(data => props.showList())
            .catch(error => console.log(error.message));
        } else {
            // ایجاد محصول جدید
            product.createdAt = new Date().toISOString().slice(0, 10);
            fetch("http://localhost:3005/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Unexpected Server Response");
                }
                return response.json();
            })
            .then(data => props.showList())
            .catch(error => console.log(error.message));
        }
    };
    
    const handleAddMainOption = () => {
        if (newMainOption) {
            setMainOptions([...mainOptions, { name: newMainOption, startDate: newMainStartDate, endDate: newMainEndDate, subOptions: [] }]);
            setNewMainOption('');
            setNewMainStartDate('');
            setNewMainEndDate('');
        }
    };
    
    const handleAddSubOption = () => {
        if (newSubOption && selectedMainOption) {
            setSubOptions(prev => {
                const updatedSubOptions = { ...prev };
                if (!updatedSubOptions[selectedMainOption]) {
                    updatedSubOptions[selectedMainOption] = [];
                }
    
                const exists = updatedSubOptions[selectedMainOption].some(sub => sub.name === newSubOption);
                if (!exists) {
                    updatedSubOptions[selectedMainOption].push({
                        name: newSubOption,
                        startDate: newSubStartDate,
                        endDate: newSubEndDate,
                        subSubOptions: [],
                    });
                }
    
                return updatedSubOptions;
            });
    
            setNewSubOption('');
            setNewSubStartDate('');
            setNewSubEndDate('');
        }
    };
    
    const handleAddSubSubOption = () => {
        if (newSubSubOption && selectedMainOption && selectedSubOption) {
            setSubOptions(prev => {
                const updatedSubOptions = { ...prev };
                const mainOptionSubOptions = updatedSubOptions[selectedMainOption];
                const subOptionIndex = mainOptionSubOptions.findIndex(sub => sub.name === selectedSubOption);
    
                if (subOptionIndex !== -1) {
                    const subSubOptions = mainOptionSubOptions[subOptionIndex].subSubOptions;
                    const exists = subSubOptions.some(subSub => subSub.name === newSubSubOption);
    
                    if (!exists) {
                        subSubOptions.push({
                            name: newSubSubOption,
                            startDate: newSubSubStartDate,
                            endDate: newSubSubEndDate,
                        });
                    }
                }
    
                return updatedSubOptions;
            });
    
            setNewSubSubOption('');
            setNewSubSubStartDate('');
            setNewSubSubEndDate('');
        }
    };
    
    
    return (
            <>
                <h2 className="text-center mb-3">{props.product.id ? "Edit Product" : "Create New Product"}</h2>
        
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        {errorMessage}
        
                        <form onSubmit={(event) => handleSubmit(event)}>

                                        
                            {props.product.id && (
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">ID</label>
                                    <div className="col-sm-8">
                                        <input
                                            readOnly
                                            className="form-control-plaintext"
                                            name="id"
                                            defaultValue={props.product.id}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            
                            <h3>فرم داینامیک با تاریخ‌های جلالی</h3>
        
                            {/* افزودن گزینه اصلی */}
                            <div className="mb-3">
                                <label htmlFor="mainOption" className="form-label">اضافه کردن گزینه اصلی</label>
                                <input
                                    type="text"
                                    // name='name'
                                    id="mainOption"
                                    className="form-control"
                                    value={newMainOption}
                                    onChange={(e) => setNewMainOption(e.target.value)}
                                />
                                <label htmlFor="mainStartDate" className="form-label mt-2">تاریخ شروع</label>
                                <input
                                    type="text"
                                    // name='startName'
                                    id="mainStartDate"
                                    className="form-control"
                                    value={newMainStartDate}
                                    onChange={(e) => setNewMainStartDate(e.target.value)}
                                    placeholder="مثال: 1403/01/01"
                                />
                                <label htmlFor="mainEndDate" className="form-label mt-2">تاریخ پایان</label>
                                <input
                                    type="text"
                                    // name='endName'
                                    id="mainEndDate"
                                    className="form-control"
                                    value={newMainEndDate}
                                    onChange={(e) => setNewMainEndDate(e.target.value)}
                                    placeholder="مثال: 1403/12/01"
                                />
                                <button type="button" className="btn btn-primary mt-2" onClick={handleAddMainOption}>
                                    اضافه کردن گزینه اصلی
                                </button>
                            </div>
        
                            {/* انتخاب گزینه اصلی برای اضافه کردن زیر گزینه */}
                            {mainOptions.length > 0 && (
                                <div className="mb-3">
                                    <label htmlFor="mainOptionSelect" className="form-label">انتخاب گزینه اصلی برای زیر گزینه‌ها</label>
                                    <select
                                        id="mainOptionSelect"
                                        className="form-select"
                                        value={selectedMainOption}
                                        onChange={(e) => setSelectedMainOption(e.target.value)}
                                    >
                                        <option value="">انتخاب گزینه اصلی</option>
                                        {mainOptions.map((option, index) => (
                                            <option key={index} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
        
                            {/* افزودن زیر گزینه به گزینه اصلی انتخاب شده */}
                            {selectedMainOption && (
                                <div>
                                    <label htmlFor="subOption" className="form-label">اضافه کردن زیر گزینه برای {selectedMainOption}</label>
                                    <input
                                        type="text"
                                        // name='name2'
                                        id="subOption"
                                        className="form-control"
                                        value={newSubOption}
                                        onChange={(e) => setNewSubOption(e.target.value)}
                                    />
                                    <label htmlFor="subStartDate" className="form-label mt-2">تاریخ شروع زیر گزینه</label>
                                    <input
                                        type="text"
                                        // name='startName2'
                                        id="subStartDate"
                                        className="form-control"
                                        value={newSubStartDate}
                                        onChange={(e) => setNewSubStartDate(e.target.value)}
                                        placeholder="مثال: 1403/01/01"
                                    />
                                    <label htmlFor="subEndDate" className="form-label mt-2">تاریخ پایان زیر گزینه</label>
                                    <input
                                        type="text"
                                        // name='endName2'
                                        id="subEndDate"
                                        className="form-control"
                                        value={newSubEndDate}
                                        onChange={(e) => setNewSubEndDate(e.target.value)}
                                        placeholder="مثال: 1403/12/01"
                                    />
                                    <button type="button" className="btn btn-success mt-2" onClick={handleAddSubOption}>
                                        اضافه کردن زیر گزینه
                                    </button>
                                </div>
                            )}
        
                            {/* انتخاب زیر گزینه برای اضافه کردن زیر زیر گزینه */}
                            {selectedMainOption && subOptions[selectedMainOption] && (
                                <div className="mb-3">
                                    <label htmlFor="subOptionSelect" className="form-label">انتخاب زیر گزینه برای اضافه کردن زیر زیر گزینه</label>
                                    <select
                                        id="subOptionSelect"
                                        className="form-select"
                                        value={selectedSubOption}
                                        onChange={(e) => setSelectedSubOption(e.target.value)}
                                    >
                                        <option value="">انتخاب زیر گزینه</option>
                                        {subOptions[selectedMainOption].map((sub, index) => (
                                            <option key={index} value={sub.name}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
        
                            {/* افزودن زیر زیر گزینه به زیر گزینه انتخاب شده */}
                            {selectedSubOption && (
                                <div>
                                    <label htmlFor="subSubOption" className="form-label">اضافه کردن زیر زیر گزینه برای {selectedSubOption}</label>
                                    <input
                                        type="text"
                                        // name='name3'
                                        id="subSubOption"
                                        className="form-control"
                                        value={newSubSubOption}
                                        onChange={(e) => setNewSubSubOption(e.target.value)}
                                    />
                                    <label htmlFor="subSubStartDate" className="form-label mt-2">تاریخ شروع زیر زیر گزینه</label>
                                    <input
                                        type="text"
                                        // name='startName3'
                                        id="subSubStartDate"
                                        className="form-control"
                                        value={newSubSubStartDate}
                                        onChange={(e) => setNewSubSubStartDate(e.target.value)}
                                        placeholder="مثال: 1403/01/01"
                                    />
                                    <label htmlFor="subSubEndDate" className="form-label mt-2">تاریخ پایان زیر زیر گزینه</label>
                                    <input
                                        type="text"
                                        // name='endName3'
                                        id="subSubEndDate"
                                        className="form-control"
                                        value={newSubSubEndDate}
                                        onChange={(e) => setNewSubSubEndDate(e.target.value)}
                                        placeholder="مثال: 1403/12/01"
                                    />
                                    <button type="button" className="btn btn-success mt-2" onClick={handleAddSubSubOption}>
                                        اضافه کردن زیر زیر گزینه
                                    </button>
                                </div>
                            )}
        
                            {/* دکمه‌های Save و Cancel */}
                            <div className="row">
                                <div className="offset-sm-4 col-sm-4 d-grid">
                                    <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                                </div>
                                <div className="col-sm-4 d-grid">
                                    <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">Cancel</button>
                                </div>
                            </div>
        
                            {/* نمایش گزینه‌ها، زیر گزینه‌ها و زیر زیر گزینه‌ها */}
                            {mainOptions.length > 0 && (
                                <div className="mt-4">
                                    <h5>گزینه‌های اصلی، زیر گزینه‌ها و زیر زیر گزینه‌ها:</h5>
                                    <ul>
                                        {mainOptions.map((mainOption, index) => (
                                            <li key={index}>
                                                <strong>گزینه اصلی: {mainOption.name}</strong>
                                                <ul>
                                                    <li>تاریخ شروع: {mainOption.startDate}</li>
                                                    <li>تاریخ پایان: {mainOption.endDate}</li>

                                                    {/* نمایش زیر گزینه‌ها */}
                                                    {subOptions[mainOption.name] &&
                                                        subOptions[mainOption.name].map((subOption, subIndex) => (
                                                            <li key={subIndex}>
                                                                <strong>زیر گزینه: {subOption.name}</strong>
                                                                <ul>
                                                                    <li>تاریخ شروع: {subOption.startDate}</li>
                                                                    <li>تاریخ پایان: {subOption.endDate}</li>

                                                                    {/* نمایش زیر زیر گزینه‌ها */}
                                                                    {subOption.subSubOptions && subOption.subSubOptions.length > 0 && (
                                                                        <div>
                                                                            <h5>زیر زیر گزینه‌ها:</h5>
                                                                            <ul>
                                                                                {subOption.subSubOptions.map((subSub, subSubIndex) => (
                                                                                    <li key={subSubIndex}>
                                                                                        <strong>زیر زیر گزینه: {subSub.name}</strong>
                                                                                        <ul>
                                                                                            <li>تاریخ شروع: {subSub.startDate}</li>
                                                                                            <li>تاریخ پایان: {subSub.endDate}</li>
                                                                                        </ul>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </ul>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </>
        )

    }
