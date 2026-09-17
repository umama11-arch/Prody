import React, { useEffect, useState } from "react";
import "./analytics.css";
import axios from "axios";
import {PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Goal from "./goal";
import Ai from "./Ai";
// import { replaceTooltipEntrySettings } from "recharts/types/state/tooltipSlice";

const Analytics = ({ tasks = [], todaytasks = [] ,isloginuser,setPage}) => {
  const [chartData, setChartData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
const [bestStreak, setBestStreak] = useState(0);
  const [showgoal, setshowgoal] = useState(false);
  const [showcalendar, setshowcalendar] = useState(false);
const [showstreak, setshowstreak] = useState(false);
  // const [showcalendar, setshowcalendar]=useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [monthlyProductivity, setMonthlyProductivity] = useState([]);
  const [day,setday]=useState("");
  const [maximum,setmaximum]=useState(0);
 const [currmonth,setcurrmonth]=useState(0)
 const [currdays,setcurrdays]=useState(0);

 const [lastweekproductivity,setlastweekproductivity]=useState(0)
 const [calendarData,setcalendarData]=useState([])
 const API_URL = process.env.REACT_APP_API_URL;

  // BASIC STATS
  const completed = todaytasks.filter((t) => t.completed).length;

  const pending = todaytasks.length - completed;

  const todayCompleted = todaytasks.filter((t) => t.completed).length;

  const todayTotal = todaytasks.length;
  console.log("todsym total",todayTotal)

  const todayRate =todayTotal === 0? 0: ((todayCompleted / todayTotal) * 100).toFixed(1);
console.log(todayRate)
  // PIE DATA
  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  let comp=0;
  const categoryStats = tasks.reduce((acc, task) => {

  const cat = task.category || "Other";

  if (!acc[cat]) {
    acc[cat] = {
      total: 0,
      completed: 0
    };
  }

  acc[cat].total += 1;

  if (task.completed === true) {
    acc[cat].completed += 1;
  }

  return acc;

}, {});

const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
  name,
  value,
  productivity: value.total === 0
    ? 0
    : (value.completed / value.total) * 100
}

)
);

let maximumCategoryProductivity = 0;
let mostProductiveCategory = "-";

categoryData.forEach((category) => {

  if (category.productivity > maximumCategoryProductivity) {

    maximumCategoryProductivity = category.productivity;
    mostProductiveCategory = category.name;

  }

});
console.log(maximumCategoryProductivity)
const topCategory =
categoryData.sort(
(a,b)=>b.value-a.value
)[0]


function getLocalDayKey(dateObj) {
  const year = dateObj.getFullYear();
  // Month index is 0-based, so add 1
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// this month productivity 
const currentmonthproductivity=async()=>{
  const res = await axios.get(
    `${API_URL}/currmonthpro/${isloginuser}`
  );
  return res.data;
}

const currentmonthaverage=async()=>{
  const reports=await currentmonthproductivity()
  
  const sum=reports.reduce((total,report)=>{
    const percentage=Number(report.taskPercent)
    return total+percentage;
  },0)

  const average=sum/reports.length;
  setcurrmonth(average);
  const productiveDays = reports.filter(
  (report) => Number(report.taskPercent) >= 50
).length;
  setcurrdays(productiveDays);



  const calendar = reports.map((report) => ({
  date: getLocalDayKey(new Date(report.date)),
  productivity: Number(report.taskPercent)
}));
setcalendarData(calendar)
}

const getallproductivity = async () => {
  const res = await axios.get(
    `${API_URL}/getallproductivity/${isloginuser}`
  );

  return res.data;
};

const allyearproductivity = async () => {
  const report = await getallproductivity();

  const month = [
    { day: "Jan", productivity: 0, planned: 0 },
    { day: "Feb", productivity: 0, planned: 0 },
    { day: "Mar", productivity: 0, planned: 0 },
    { day: "Apr", productivity: 0, planned: 0 },
    { day: "May", productivity: 0, planned: 0 },
    { day: "Jun", productivity: 0, planned: 0 },
    { day: "Jul", productivity: 0, planned: 0 },
    { day: "Aug", productivity: 0, planned: 0 },
    { day: "Sep", productivity: 0, planned: 0 },
    { day: "Oct", productivity: 0, planned: 0 },
    { day: "Nov", productivity: 0, planned: 0 },
    { day: "Dec", productivity: 0, planned: 0 }
  ];

  const date = new Date();

  report.forEach((r) => {
    const reportDate = new Date(r.date);

    if (reportDate.getFullYear() === date.getFullYear()) {
      const index = reportDate.getMonth();

      month[index].productivity += Number(r.taskPercent);
      month[index].planned++;
    }
  });

  month.forEach((m) => {
    if (m.planned > 0) {
      m.productivity = m.productivity / m.planned;
    } else {
      m.productivity = null;
    }
  });

  return month;
};

useEffect(() => {
  const loadData = async () => {
    const data = await allyearproductivity();
    setChartData(data);
  };

  loadData();
}, []);
let count = 0;
let maxi = 0;

const getstreak = async () => {

  const reports = await getallproductivity();

  reports.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  reports.forEach((report) => {

    if (Number(report.taskPercent) >= 50) {

      count++;

      maxi = Math.max(count, maxi);

    } else {

      count = 0;

    }
setCurrentStreak(count);
setBestStreak(maxi)
  });

  console.log("Current streak:", count);
  console.log("Best streak:", maxi);
};

const currentMonth = new Date().getMonth();
const currentyear=new Date().getFullYear();


// getMonthlyProductivity(tasks/)
const prevmonth = (currentMonth - 1 + 12) % 12;
const prevmonthdata=monthlyProductivity[prevmonth];
const currentMonthData = monthlyProductivity[currentMonth];
const currentProductivity = currentMonthData?.productivity || 0;
const previousProductivity = prevmonthdata?.productivity || 0;

const firstDay = new Date(currentyear, currentMonth, 1).getDay();

const daysInMonth =
new Date(currentyear, currentMonth + 1, 0).getDate();
  const calendarDays = [];
  
  for (let i = 0; i < firstDay; i++) {
  calendarDays.push(null);
}

for (let day = 1; day <= daysInMonth; day++) {
  calendarDays.push(day);
}
const getlastweeklyreports = async () => {

  const res = await axios.get(
    `${API_URL}/getlastweeklyreport/${isloginuser}`
  );
  
  return res.data;
};

const loadlastweekreports=async()=>{
  const reports=await getlastweeklyreports();
if (reports.length === 0) {
  setday(null);
  setmaximum(0);
  setlastweekproductivity(0);
  return;
}
  const sum=reports.reduce((total,report)=>{
    const percentage=Number(report.taskPercent)
    return total+percentage
  },0)
  const averageproductivity=reports.length===0?0:sum/reports.length;
  setlastweekproductivity(averageproductivity);
  console.log("i am average productivity",(averageproductivity,"%"));
  
  
  const bestWorst = reports.reduce(
  (result, report) => {
    
    const percentage = Number(report.taskPercent);
    
    if (percentage > result.best.percentage) {
      result.best = {
        percentage,
        date: report.date
      };
    }
    
    if (percentage < result.worst.percentage) {
      result.worst = {
        percentage,
        date: report.date
      };
    }

    return result;
  },
  {
    best: {
      percentage: -Infinity,
      date: null
    },
    worst: {
      percentage: Infinity,
      date: null
    }
  }
);


const bestDay = new Date(bestWorst.best.date).toLocaleDateString(
  "en-US",
  { weekday: "long" }
);
setday(bestDay)
setmaximum(bestWorst.best.percentage)
const worstDay = new Date(bestWorst.worst.date).toLocaleDateString(
  "en-US",
  { weekday: "long" }
);
}
loadlastweekreports()
const getweeklyreports=async()=>{
  const res=await axios.get(`${API_URL}/getweeklyreport/${isloginuser}`)
  return res.data;
}

const loadReports = async () => {
  
  const reports = await getweeklyreports();


const day = [
  { day: "Mon", productivity: null },
  { day: "Tue", productivity: null },
    { day: "Wed", productivity: null },
    { day: "Thu", productivity: null },
    { day: "Fri", productivity: null },
    { day: "Sat", productivity: null },
    { day: "Sun", productivity: null }
  ];
  
  const productivityData = day.map((d) => {
    
    const report = reports.find((r) => {

      const reportDay = new Date(r.date).toLocaleDateString("en-US", {
        weekday: "short"
      });

      return reportDay === d.day;
    });

    return {
      day: d.day,
      productivity: report ? report.taskPercent : null
    };
  });
  setWeekdays(productivityData);
};
let productivedays = 0;
let sum = 0;

weekdays.forEach((day) => {

  if (day.productivity !== null) {
    productivedays++;
    sum += Number(day.productivity);
  }
  
});

const averageproductivity =
productivedays === 0
    ? 0
    : sum / productivedays;
    
    
    useEffect(()=>{
      loadReports()  
      loadlastweekreports()
      getstreak()
      currentmonthaverage()
      goalreport()
      

    },[])
    

const getAllProductivity = async () => {
  const res = await axios.get(
    `${API_URL}/allproductivity/${isloginuser}`
  );

  return res.data;
};
  const getgoal=async()=>{
        const res=await axios.get(`${API_URL}/getgoal?userid=${isloginuser}`)
        return res.data;
    };
const goalreport = async () => {
 const reports= await getgoal();
 const productivityReports = await getAllProductivity();

  const goalData = reports.map((goal) => {
    const created = new Date(goal.createdAt);
    const endDate = new Date(created);

    if (goal.durationUnit === "days") {
      endDate.setDate(endDate.getDate() + goal.duration);
    }

    if (goal.durationUnit === "months") {
      endDate.setMonth(endDate.getMonth() + goal.duration);
    }
    if (goal.durationUnit === "weeks") {
      endDate.setDate(endDate.getDate() + goal.duration * 7);
    }

     if (goal.durationUnit === "years") {
      endDate.setFullYear(endDate.getFullYear() + goal.duration);
    }
   const today = new Date();
created.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);
endDate.setHours(0, 0, 0, 0);
const diff = today - created;
const daysElapsed = Math.floor(diff / (1000 * 60 * 60 * 24));

const diffre=endDate-today;
const daysRemaining=Math.floor(diffre / (1000 * 60 * 60 * 24 ));
    // const percentages = [];

    // productivityReports.forEach((report) => {
      
    //   const found = report.goalPercent.find(
    //     (g) => String( g.goalid) === String( goal._id)
    //   );

    //   if (found) {
    //     percentages.push(found.percentage);
    //   }

    // });

    const history = [];

productivityReports.forEach((report) => {

  const found = (report.goalPercent || []).find(
    (g) => String(g.goalid) === String(goal._id)
  );

  if (found) {
    history.push({
      date: report.date,
      percentage: Number(found.percentage)
    });
  }

});
const percentages = history.map(
  (item) => item.percentage
);
    const total = percentages.reduce(
  (sum, percentage) => sum + percentage,
  0
)
const average =
  percentages.length === 0
    ? null
    : total / percentages.length;
let count=0,mincount=0,longestinactive=0;
percentages.forEach((per)=>{
  if (per>0){
    count++;
    mincount=0;
  }
  if(per===0){
    mincount++;
    longestinactive=Math.max(longestinactive,mincount)
  }
})

const inactivedays=percentages.length-count

 const totalGoalDays = Math.ceil(
    (endDate - created) /
    (1000 * 60 * 60 * 24)
  );

  const earlyDays = Math.ceil(
    totalGoalDays * 0.20
  );

  const earlyHistory = history.filter((item) => {
    const itemDate = new Date(item.date);

    const daysFromStart = Math.floor(
      (itemDate - created) /
      (1000 * 60 * 60 * 24)
    );

    return daysFromStart < earlyDays;
  });

  const earlyAverage =
    earlyHistory.length === 0
      ? null
      : earlyHistory.reduce(
          (sum, item) => sum + item.percentage,
          0
        ) / earlyHistory.length;


  // -------------------------
  // RECENT AVERAGE
  // -------------------------

  const recentCount = Math.ceil(
    history.length * 0.20
  );

  const recentHistory =
    recentCount > 0
      ? history.slice(-recentCount)
      : [];

  const recentAverage =
    recentHistory.length === 0
      ? null
      : recentHistory.reduce(
          (sum, item) => sum + item.percentage,
          0
        ) / recentHistory.length;


    return {
      goalid: goal._id,
      title: goal.title,
      createdAt: created,
      endDate: endDate,
      duration: goal.duration,
      durationUnit: goal.durationUnit,
      dayelapsed:daysElapsed,
      daysremaining:daysRemaining,
      averag:average,
      activedays:count,
      Inactivedays:inactivedays,
      history,
      longestinactive,
      earlyAverage,
      recentAverage,
      currentinactive:mincount
    };
  });
return goalData
  console.log("data",goalData);
};

console.log("i am ",isloginuser)
const monthName = new Date(2026, currentMonth ).toLocaleString("en-US", {
  month: "long"
});


// const cuurentmonthproductivity=currentMonth.productivity;
// console.log("data shown",currentMonth)
// console.log(topCategory)
return (
  <div className="analytics-container">

    {/* ================= HEADER ================= */}
{/* <button onClick={reports}></button> */}
    <div className="header-box dashboard-header">
      <div>
        <h2>📊 Productivity Dashboard</h2>
        <p>Track your habits, productivity & performance</p>
      </div>

      <div className="header-actions">

        <button
          className="utility-button"
          onClick={() => setshowgoal(true)}
          title="Monthly goal"
          >
          🎯
        </button>

        <button
          className="utility-button"
          onClick={() => setshowstreak(true)}
          title="Streak"
          >
          🔥
        </button>

        <button
          className="utility-button"
          onClick={() => setshowcalendar(true)}
          title="Calendar"
          >
          📅
        </button>

      </div>

    </div>
 

    {/* ================= OVERVIEW ================= */}


    <div className="section-title">
      <h3>Overview</h3>
    </div>

    <div className="card-row">

      <div className="card highlight">
        <h4>{monthName} Productivity</h4>

        <h1>
          {(currmonth || 0).toFixed(1)}%
        </h1>

        <p>
          {currdays || 0} productive days
        </p>

      </div>


      <div className="card">

        <h4>Today</h4>

        <h1>{todayRate}%</h1>

        <p>
          {todayCompleted} / {todayTotal} tasks
        </p>

      </div>

 <div className="card">

        <h4>Average Productivity of this week</h4>

        <h1>{averageproductivity}%</h1>

       
      </div>
      <div className="card">

        <h4>Last week average</h4>
        <h1>{lastweekproductivity}%</h1>

      </div>

    </div>
<div className="ai-mentor-bar">
  <div className="ai-mentor-info">
    <div className="ai-mentor-icon">🤖</div>

    <div>
      <h3>AI Mentor</h3>
      <p>
        Get insights about your productivity and improve your routine.
      </p>
    </div>
  </div>
<button
  className="ai-mentor-btn"
  onClick={() => {
    console.log("BUTTON CLICKED");
    setPage("Ai");
  }}
>
  Talk to AI Mentor →
</button>
</div>


    {/* ================= INSIGHTS ================= */}

    <div className="section-title">
      <h3>Insights</h3>
    </div>

    <div className="insights-grid">

      <div className="card insight-card">

        <h4>Best Day</h4>

        <h2>
          {day || "-"} 🔥
        </h2>

        <p>
          {maximum.toFixed(1)}% productivity
        </p>

      </div>


      <div className="card insight-card">

        <h4>Performance</h4>

        {averageproductivity > lastweekproductivity ? (

          <>
            <h2>↑ Improving</h2>

            <p>
              +{(
                averageproductivity -
                lastweekproductivity
              ).toFixed(1)}% from last month
            </p>
          </>

        ) : averageproductivity < lastweekproductivity ? (

          <>
            <h2>↓ Decreased</h2>

            <p>
              -{(
                lastweekproductivity -
                averageproductivity
              ).toFixed(1)}% from last week
            </p>
          </>

        ) : (

          <>
            <h2>→ Stable</h2>
            <p>No change from last month.</p>
          </>

        )}

      </div>


      <div className="card insight-card">

        <h4>Productive Category</h4>

        <h2>
          {mostProductiveCategory}
        </h2>

        <p>
          {maximumCategoryProductivity.toFixed(1)}% productivity
        </p>

      </div>

    </div>
    {/* ================= TASK DISTRIBUTION ================= */}

    <div className="section-title">
      <h3>Task Distribution</h3>
    </div>

    <div className="chart-box task-distribution">

      <div className="chart-heading">
        <div>
          <h3>Completed vs Pending</h3>
          <p>Overall task completion</p>
        </div>

        <span className="task-total">
          {todaytasks.length} total
        </span>
      </div>


      <div className="task-distribution-body">

        <ResponsiveContainer
          width="100%"
          height={240}
        >

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={78}
              innerRadius={52}
              paddingAngle={3}
            >

              {pieData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>


        <div className="task-distribution-summary">

          <div className="distribution-item">

            <span className="distribution-dot completed-dot"></span>

            <div>
              <span>Completed</span>
              <strong>{completed}</strong>
            </div>

          </div>


          <div className="distribution-item">

            <span className="distribution-dot pending-dot"></span>

            <div>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>

          </div>

        </div>

      </div>

    </div>


    {/* ================= WEEKLY PERFORMANCE ================= */}

    <div className="section-title">
      <h3>Weekly Performance</h3>
    </div>

    <div className="chart-box weekly-chart">

      <div className="chart-heading">

        <div>
          <h3>Weekly Productivity</h3>
          <p>How productive you were each day</p>
        </div>

      </div>


      <div className="weekly-progress">

        {weekdays.map((item) => {

          const productivity = Number(
            item.productivity
          );

          return (

            <div
              className="weekly-day"
              key={item.day}
            >

              <div className="weekly-day-top">

                <span>{item.day}</span>

                <strong>
                  {productivity}%
                </strong>

              </div>


              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{
                    width: `${productivity}%`
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>

    </div>


    {/* ================= MONTHLY ================= */}

    <div className="section-title">
      <h3>Monthly Performance</h3>
    </div>

    <div className="chart-box weekly-chart">

      <div className="chart-heading">

        <div>
          <h3>Monthly Productive Days</h3>
          <p>Productive days across the year</p>
        </div>

      </div>


      <ResponsiveContainer
        width="100%"
        height={280}
      >

        <BarChart data={chartData}>

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="productive"
            fill="#6366F1"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>


    {/* ================= CATEGORY ANALYSIS ================= */}

    <div className="section-title">
      <h3>Category Analysis</h3>
    </div>


    <div className="category-layout">


      {/* CATEGORY PRODUCTIVITY */}

      <div className="chart-box category-productivity">

        <div className="chart-heading">

          <div>
            <h3>Category Productivity</h3>
            <p>Completion rate by category</p>
          </div>

        </div>


        <div className="category-progress-list">

          {categoryData.map((category) => {

            const productivity =
              Number(
                category.productivity.toFixed(1)
              );

            return (

              <div
                className="category-progress"
                key={category.name}
              >

                <div className="category-progress-top">

                  <span>
                    {category.name}
                  </span>

                  <span>
                    {category.value.completed}/
                    {category.value.total}
                    {" · "}
                    {productivity}%
                  </span>

                </div>


                <div className="category-track">

                  <div
                    className="category-fill"
                    style={{
                      width: `${productivity}%`
                    }}
                  />

                </div>

              </div>

            );

          })}

        </div>

      </div>


      {/* TOP CATEGORY */}

      <div className="card top-category-card">

        <span className="top-category-icon">
          ⭐
        </span>

        <h4>Top Category</h4>

        <h1>
          {topCategory?.name || "-"}
        </h1>

        <p>
          Most used category
        </p>

      </div>
    </div>


    {/* ================= STREAK MODAL ================= */}

    {showstreak && (

      <div
        className="utility-overlay"
        onClick={() => setshowstreak(false)}
      >

        <div
          className="utility-modal streak-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="utility-modal-header">

            <div>
              <h3>🔥 Streak</h3>
              <p>Your consistency</p>
            </div>

            <button
              className="modal-close"
              onClick={() => setshowstreak(false)}
            >
              ✕
            </button>

          </div>


          <div className="streak-content">

            <div className="streak-stat">

              <span>Current Streak</span>

              <strong>
           {currentStreak}     
              </strong>

              <small>
                days 🔥
              </small>

            </div>


            <div className="streak-divider"></div>


            <div className="streak-stat">

              <span>Best Streak</span>

              <strong>
                {bestStreak}
              </strong>

              <small>
                days 🏆
              </small>

            </div>

          </div>

        </div>

      </div>

    )}


    {/* ================= CALENDAR MODAL ================= */}

    {showcalendar && (

      <div
        className="calendar-overlay"
        onClick={() => setshowcalendar(false)}
      >

        <div
          className="calendar-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="calendar-modal-header">

            <div>

              <h3>
                {currentMonthData?.day} {currentyear}
              </h3>

              <p>
                {monthName} productivity
              </p>

            </div>


            <button
              className="calendar-close"
              onClick={() => setshowcalendar(false)}
            >
              ✕
            </button>

          </div>


          <div className="calendar-legend">

            <span>
              <i className="legend productive"></i>
              Productive
            </span>

            <span>
              <i className="legend not-productive"></i>
              Not productive
            </span>

            <span>
              <i className="legend no-task"></i>
              No tasks
            </span>

          </div>


          <div className="weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

          </div>


          <div className="calendar-grid">

            {calendarDays.map((day, index) => {

              if (day === null) {

                return (
                  <div
                    key={index}
                    className="calendar-day empty"
                  />
                );

              }


              const date = new Date(
                currentyear,
                currentMonth,
                day
              );

              const dayKey =
                getLocalDayKey(date);

              const dayData = calendarData.find(
  (item) => item.date === dayKey
);

const productivity = dayData
  ? dayData.productivity
  : null;

             
              let dayClass = "no-task";

              if (productivity !== null) {

                dayClass =
                  productivity >= 50
                    ? "productive"
                    : "not-productive";

              }


              const today = new Date();

              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentyear === today.getFullYear();


              return (

                <div
                  key={index}
                  className={`calendar-day ${dayClass} ${
                    isToday ? "today" : ""
                  }`}
                >

                  <span>{day}</span>

                  {productivity !== null && (

                    <small>
                      {productivity.toFixed(0)}%
                    </small>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      </div>

    )}


    {/* ================= GOAL MODAL ================= */}

    {showgoal && (

      <div
        className="utility-overlay"
        onClick={() => setshowgoal(false)}
      >

        <div
          className="utility-modal goal-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="utility-modal-header">

            <div>

              <h3>🎯 Monthly Goal</h3>

              <p>
                Your progress this month
              </p>

            </div>

            <button
              className="modal-close"
              onClick={() => setshowgoal(false)}
            >
              ✕
            </button>

          </div>


          <div className="goal-content">

            <div className="goal-number">

              <strong>
                {currentMonthData?.productive || 0}
              </strong>

              <span>
                / {currentMonthData?.planned || 0}
              </span>

            </div>


            <div className="goal-progress">

              <div
                className="goal-progress-fill"
                style={{
                  width: `${
                    currentMonthData?.planned > 0
                      ? Math.min(
                          (
                            (currentMonthData?.productive || 0) /
                            currentMonthData.planned
                          ) * 100,
                          100
                        )
                      : 0
                  }%`
                }}
              />

            </div>


            <p className="goal-percentage">

              {currentMonthData?.planned > 0
                ? (
                    (
                      (currentMonthData?.productive || 0) /
                      currentMonthData.planned
                    ) * 100
                  ).toFixed(0)
                : 0}
              % completed

            </p>


            <p className="goal-message">

              {currentMonthData?.planned > 0 &&
              currentMonthData?.productive ===
                currentMonthData.planned

                ? "🎉 Goal completed!"

                : "Keep going! You're doing great 💪"}

            </p>

          </div>

        </div>

      </div>

    )}

  </div>
);
};

export default Analytics;