
import React, { useState } from 'react';
import moment from 'jalali-moment';
import 'bootstrap/dist/css/bootstrap.min.css';


const DateDifferenceCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysDifference, setDaysDifference] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentDate, setCurrentDate] = useState('');

  const handleCalculate = () => {
    if (startDate && endDate) {
      const start = moment(startDate, 'jYYYY-jMM-jDD');
      const end = moment(endDate, 'jYYYY-jMM-jDD');
      const diff = end.diff(start, 'days');
      setDaysDifference(diff);

      // محاسبه درصد پیشرفت بر اساس تعداد روزهای طی‌شده
      const today = moment();
      const daysPassed = today.diff(start, 'days');
      const calculatedProgress = Math.min((daysPassed / diff) * 100, 100);
      setProgress(calculatedProgress);

      // نمایش تاریخ فعلی در پیشرفت نوار
      const currentProgressDate = start.add(daysPassed, 'days').format('jYYYY-jMM-jDD');
      setCurrentDate(currentProgressDate);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <span className="card-title text-center mb-4"></span>

          <div className="form-group mb-3">
            <label>تاریخ شروع:</label>
            <input
              type="text"
              className="form-control"
              placeholder="۱۴۰۲-۰۱-۰۱"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label>تاریخ پایان:</label>
            <input
              type="text"
              className="form-control"
              placeholder="۱۴۰۲-۰۲-۰۱"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleCalculate}>
            محاسبه فاصله
          </button>

          {/* نمایش فاصله و progress bar */}
          {daysDifference !== null && (
            <>
              <p className="alert alert-info mt-4 text-center">
                فاصله بین دو تاریخ: {daysDifference} روز
              </p>
              <div className="d-flex justify-content-between mb-1">
                <span>{startDate}</span>
                <span>{endDate}</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {currentDate}
                  ({Math.round(progress)}%)
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    
    </div>
  );
};

export default DateDifferenceCalculator();
