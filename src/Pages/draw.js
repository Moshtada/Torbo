import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DrawMain = () => {
  const location = useLocation();
  const { productId } = location.state || {}; // دریافت ID از state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekPercentages, setWeekPercentages] = useState([]); // برای ذخیره درصدهای هفته‌ها
  const [weeks, setWeeks] = useState([]); // هفته‌ها

  const [subOptionPercentages, setSubOptionPercentages] = useState([]); // درصدهای زیرگزینه‌ها
  const [subSubOptionPercentages, setSubSubOptionPercentages] = useState([]); // درصدهای زیر زیرگزینه‌ها

  // تابع برای محاسبه شروع و پایان هر هفته
  const getWeekRange = (startDate, endDate) => {
    const weeks = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // شروع هفته باید از شنبه باشد
    const dayOfWeek = start.getDay();
    const startOfWeek = new Date(start.setDate(start.getDate() - dayOfWeek)); // شنبه هفته

    // ایجاد هفته‌ها
    let currentWeekStart = new Date(startOfWeek);
    while (currentWeekStart <= end) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // پایان هفته (شنبه + 6 روز)
      weeks.push({
        start: currentWeekStart.toISOString().split('T')[0], // فقط تاریخ بدون ساعت
        end: currentWeekEnd.toISOString().split('T')[0],
        percentage: 0, // درصد اولیه
      });
      currentWeekStart.setDate(currentWeekStart.getDate() + 7); // هفته بعد
    }

    return weeks;
  };

  useEffect(() => {
    if (productId) {
      // درخواست به فایل JSON یا API
      fetch(`http://localhost:3005/products?id=${productId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          return response.json();
        })
        .then((data) => {
          if (data.length > 0) {
            setProduct(data[0]); // محصول یافت شده
            console.log("Fetched product data:", data[0]); // نمایش داده‌ها
          } else {
            setError("Product not found");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (product && product.mainOptions?.length > 0) {
      const mainOption = product.mainOptions[0];
      if (mainOption.startDate && mainOption.endDate) {
        const computedWeeks = getWeekRange(mainOption.startDate, mainOption.endDate);
        setWeeks(computedWeeks);
        setWeekPercentages(computedWeeks.map(() => ({ percentage: 0 })));
      }
    }
  }, [product]);

  // تابع برای تغییر درصد یک هفته
  const handlePercentageChange = (index, value, type) => {
    let newPercentages = [];
    if (type === "week") {
      newPercentages = [...weekPercentages];
      newPercentages[index].percentage = value;
      setWeekPercentages(newPercentages);
    } else if (type === "subOption") {
      newPercentages = [...subOptionPercentages];
      newPercentages[index].percentage = value;
      setSubOptionPercentages(newPercentages);
    } else if (type === "subSubOption") {
      newPercentages = [...subSubOptionPercentages];
      newPercentages[index].percentage = value;
      setSubSubOptionPercentages(newPercentages);
    }
  };

  // محاسبه جمع درصدها
  const totalPercentage = [...weekPercentages, ...subOptionPercentages, ...subSubOptionPercentages].reduce(
    (sum, option) => sum + option.percentage,
    0
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>No product data available.</p>;
  }

  return (
    <div>
      <h1>Product Details</h1>
      <h2>{product.name}</h2>

      {/* نمایش گزینه‌های اصلی و تاریخ‌های آنها */}
      <ul>
        {product.mainOptions?.map((mainOption, index) => (
          <li key={index}>
            <strong>گزینه اصلی: {mainOption.name}</strong>
            <ul>
              <li>تاریخ شروع: {mainOption.startDate}</li>
              <li>تاریخ پایان: {mainOption.endDate}</li>

              {/* نمایش هفته‌ها و گرفتن درصد از کاربر */}
              {mainOption.startDate && mainOption.endDate && (
                <div>
                  <h5>هفته‌ها:</h5>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex}>
                      <strong>هفته {weekIndex + 1}:</strong>
                      <p>
                        شروع هفته: {week.start} - پایان هفته: {week.end}
                      </p>
                      <input
                        type="number"
                        value={weekPercentages[weekIndex]?.percentage || 0}
                        onChange={(e) =>
                          handlePercentageChange(weekIndex, Number(e.target.value), "week")
                        }
                        max="100"
                        min="0"
                      />
                      <span>%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* نمایش زیر گزینه‌ها */}
              {mainOption.subOptions?.map((subOption, subIndex) => (
                <div key={subIndex}>
                  <h6>زیر گزینه: {subOption.name}</h6>
                  <ul>
                    <li>تاریخ شروع: {subOption.startDate}</li>
                    <li>تاریخ پایان: {subOption.endDate}</li>

                    {/* نمایش درصدهای زیر گزینه‌ها */}
                    <input
                      type="number"
                      value={subOptionPercentages[subIndex]?.percentage || 0}
                      onChange={(e) =>
                        handlePercentageChange(subIndex, Number(e.target.value), "subOption")
                      }
                      max="100"
                      min="0"
                    />
                    <span>%</span>

                    {/* نمایش زیر زیر گزینه‌ها */}
                    {subOption.subSubOptions?.map((subSubOption, subSubIndex) => (
                      <div key={subSubIndex}>
                        <h6>زیر زیر گزینه: {subSubOption.name}</h6>
                        <ul>
                          <li>تاریخ شروع: {subSubOption.startDate}</li>
                          <li>تاریخ پایان: {subSubOption.endDate}</li>

                          <input
                            type="number"
                            value={subSubOptionPercentages[subSubIndex]?.percentage || 0}
                            onChange={(e) =>
                              handlePercentageChange(subSubIndex, Number(e.target.value), "subSubOption")
                            }
                            max="100"
                            min="0"
                          />
                          <span>%</span>
                        </ul>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* نمایش جمع درصدها */}
      <h3>جمع درصدها: {totalPercentage}%</h3>
    </div>
  );
};

export default DrawMain;
