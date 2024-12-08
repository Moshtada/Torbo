
//برنامه بدون دکمه ها و بدون ذخیره در جیسون


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DrawMain = () => {
  const location = useLocation();
  const { productId } = location.state || {}; // دریافت ID از state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekPercentages, setWeekPercentages] = useState([]); // برای ذخیره درصدها
  const [subOptionPercentages, setSubOptionPercentages] = useState([]); // درصدهای زیر گزینه
  const [subSubOptionPercentages, setSubSubOptionPercentages] = useState([]); // درصدهای زیر زیر گزینه
  const [weeks, setWeeks] = useState([]); // هفته‌ها
  const [subOptionWeeks, setSubOptionWeeks] = useState([]); // هفته‌های زیر گزینه‌ها
  const [subSubOptionWeeks, setSubSubOptionWeeks] = useState([]); // هفته‌های زیر زیر گزینه‌ها

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

        // مقداردهی اولیه برای زیر گزینه‌ها و زیر زیر گزینه‌ها
        const initialSubOptionPercentages = [];
        const initialSubSubOptionPercentages = [];
        const initialSubOptionWeeks = [];
        const initialSubSubOptionWeeks = [];

        mainOption.subOptions?.forEach((subOption, subIndex) => {
          const subWeeks = getWeekRange(subOption.startDate, subOption.endDate);
          initialSubOptionWeeks[subIndex] = subWeeks;
          initialSubOptionPercentages[subIndex] = subWeeks.map(() => ({ percentage: 0 }));

          subOption.subSubOptions?.forEach((subSubOption, subSubIndex) => {
            const subSubWeeks = getWeekRange(subSubOption.startDate, subSubOption.endDate);
            if (!initialSubSubOptionWeeks[subIndex]) {
              initialSubSubOptionWeeks[subIndex] = [];
            }
            initialSubSubOptionWeeks[subIndex][subSubIndex] = subSubWeeks;
            initialSubSubOptionPercentages[subIndex] = initialSubSubOptionPercentages[subIndex] || [];
            initialSubSubOptionPercentages[subIndex][subSubIndex] = subSubWeeks.map(() => ({ percentage: 0 }));
          });
        });

        setSubOptionWeeks(initialSubOptionWeeks);
        setSubSubOptionWeeks(initialSubSubOptionWeeks);
        setSubOptionPercentages(initialSubOptionPercentages);
        setSubSubOptionPercentages(initialSubSubOptionPercentages);
      }
    }
  }, [product]);

  // تابع برای تغییر درصد یک هفته
  const handlePercentageChange = (index, value, level, subIndex = null, subSubIndex = null) => {
    if (level === "week") {
      // تغییر درصد برای هفته‌های اصلی
      const newPercentages = [...weekPercentages];
      newPercentages[index].percentage = value;
      setWeekPercentages(newPercentages);
    } else if (level === "subOption" && subIndex !== null) {
      // تغییر درصد برای هفته‌های زیر گزینه‌ها
      const newSubOptionPercentages = [...subOptionPercentages];
      newSubOptionPercentages[subIndex][index].percentage = value;
      setSubOptionPercentages(newSubOptionPercentages);
    } else if (level === "subSubOption" && subIndex !== null && subSubIndex !== null) {
      // تغییر درصد برای هفته‌های زیر زیر گزینه‌ها
      const newSubSubOptionPercentages = [...subSubOptionPercentages];
      newSubSubOptionPercentages[subIndex][subSubIndex][index].percentage = value;
      setSubSubOptionPercentages(newSubSubOptionPercentages);
    }
  };

  // محاسبه مجموع درصدها
  const mainOptionTotalPercentage = weekPercentages.reduce(
    (sum, week) => sum + week.percentage,
    0
  );
  const subOptionTotalPercentage = subOptionPercentages.reduce((sum, subOption) => {
    return sum + subOption.reduce((subSum, week) => subSum + week.percentage, 0);
  }, 0);
  const subSubOptionTotalPercentage = subSubOptionPercentages.reduce((sum, subOption) => {
    return (
      sum +
      subOption.reduce(
        (subSum, subSubOption) =>
          subSum +
          subSubOption.reduce((weekSum, week) => weekSum + week.percentage, 0),
        0
      )
    );
  }, 0);

  // محاسبه درصد نهایی (مجموع درصدها تقسیم بر 3)
  const totalPercentage =
    (mainOptionTotalPercentage + subOptionTotalPercentage + subSubOptionTotalPercentage) /
    3;

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
      <h1>جزئیات محصول</h1>
      <h2>{product.name}</h2>

      {/* نمایش درصد گزینه اصلی */}
      <div>
        <h3>درصد گزینه اصلی: {mainOptionTotalPercentage}%</h3>
        <h3>درصد زیر گزینه: {subOptionTotalPercentage}%</h3>
        <h3>درصد زیر زیر گزینه : {subSubOptionTotalPercentage}%</h3>
      </div>

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

              {/* نمایش زیر گزینه‌ها و درصد */}
              {mainOption.subOptions?.map((subOption, subIndex) => (
                <div key={subIndex}>
                  <h6>زیر گزینه: {subOption.name}</h6>
                  <ul>
                    <li>تاریخ شروع: {subOption.startDate}</li>
                    <li>تاریخ پایان: {subOption.endDate}</li>

                    {/* نمایش هفته‌های زیر گزینه‌ها */}
                    {subOptionWeeks[subIndex]?.map((week, weekIndex) => (
                      <div key={weekIndex}>
                        <strong>هفته {weekIndex + 1}:</strong>
                        <p>
                          شروع هفته: {week.start} - پایان هفته: {week.end}
                        </p>
                        <input
                          type="number"
                          value={subOptionPercentages[subIndex]?.[weekIndex]?.percentage || 0}
                          onChange={(e) =>
                            handlePercentageChange(weekIndex, Number(e.target.value), "subOption", subIndex)
                          }
                          max="100"
                          min="0"
                        />
                        <span>%</span>
                      </div>
                    ))}
                  </ul>

                  {/* نمایش زیر زیر گزینه‌ها */}
                  {subOption.subSubOptions?.map((subSubOption, subSubIndex) => (
                    <div key={subSubIndex}>
                      <h7>زیر زیر گزینه: {subSubOption.name}</h7>
                      <ul>
                        <li>تاریخ شروع: {subSubOption.startDate}</li>
                        <li>تاریخ پایان: {subSubOption.endDate}</li>

                        {/* نمایش هفته‌های زیر زیر گزینه‌ها */}
                        {subSubOptionWeeks[subIndex]?.[subSubIndex]?.map((week, weekIndex) => (
                          <div key={weekIndex}>
                            <strong>هفته {weekIndex + 1}:</strong>
                            <p>
                              شروع هفته: {week.start} - پایان هفته: {week.end}
                            </p>
                            <input
                              type="number"
                              value={subSubOptionPercentages[subIndex]?.[subSubIndex]?.[weekIndex]?.percentage || 0}
                              onChange={(e) =>
                                handlePercentageChange(
                                  weekIndex,
                                  Number(e.target.value),
                                  "subSubOption",
                                  subIndex,
                                  subSubIndex
                                )
                              }
                              max="100"
                              min="0"
                            />
                            <span>%</span>
                          </div>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* نمایش درصد نهایی */}
      <div>
        <strong>مجموع درصد نهایی: {totalPercentage.toFixed(2)}%</strong>
      </div>
    </div>
  );
};

export default DrawMain;
