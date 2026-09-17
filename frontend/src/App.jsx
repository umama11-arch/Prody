import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";
import Auth from './auth';
import toast, { Toaster } from "react-hot-toast";
import Analytics from './analytics';
import Sidebar from './sidebar';
import Ai from './Ai';
import Goal from './goal'
// import user from './user
// ';
function App() {
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [repeatDate, setRepeatDate] = useState("");
  const [repeatDays, setRepeatDays] = useState([]);
  const [todaytasks, setTodayTasks] = useState([]);
  // const [timervalue, settimervalue] = useState("");
  const [page, setPage] = useState("task");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [time, settime] = useState("")
  // const [editid, seteditid] = useState("")
  const [priority, setpriority] = useState("Medium")
  const [category, setcategory] = useState("")
  const [search, setsearch] = useState("");
  const [islogin, setislogin] = useState(false);
  const [isloginuser, setisloginuser] = useState("")
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [editTime, setEditTime] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [remainderenable, setremainderenable] = useState(false)
  const [reminderTime, setremainderTime] = useState(1)
  const [dark, setDark] = useState(false)
  const [recurring, setrecurring] = useState("none")
  const API_URL = process.env.REACT_APP_API_URL;

  // console.log(activegoal)
  console.log(isloginuser)
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {


    if (!isloginuser) return;

    const interval = setInterval(async () => {

      try {

        const res = await axios.get(`${API_URL}reminders`,
          {
            params: {
              userid: isloginuser
            }
          }
        );


        for (const task of res.data) {

          showNotification(task.task);
          await axios.patch(
            `${API_URL}/reminders/${task._id}`
          );

        }

      } catch (err) {
        console.log(err);
      }

    }, 60000);

    return () => clearInterval(interval);

  }, [isloginuser]);



  const showNotification = (taskName) => {

    console.log("triggered:", taskName);

    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {

      new Notification(
        "⏰ Task Reminder",
        {
          body: `${taskName} is due soon!`,
          requireInteraction: true,
          silent: false
        }
      );

    } else {

      toast(`⏰ ${taskName}`);

    }

  };
  const getTaskStatus = (task) => {
  const taskTime = new Date(task.time);
  const now = new Date();

  if (task.completed) {
    return "Completed";
  }

  const taskMinutes =
    taskTime.getHours() * 60 + taskTime.getMinutes();

  const nowMinutes =
    now.getHours() * 60 + now.getMinutes();

  if (taskMinutes < nowMinutes) {
    return "Overdue";
  }

  return "Upcoming";
};
  const getPriorityColor = (priority) => {
    if (priority === "Low") {
      return <div className='circleyellow'></div>;
    }

    if (priority === "Medium") {
      return <div className='circlegreen'></div>;
    }

    return <div className='circlered'></div>;
  };

  const getstatuscolor = (status) => {
    if (status === "Completed") {
      return <div className='circleyellow'></div>
    }
    else if (status === "Overdue") {
      return <div className='circlegreen'></div>
    }
    else {
      return <div className='circlered'></div>
    }
  }

  const filteredTasks = todaytasks.filter(t => {
    if (filter === "completed") {
      return t.completed;
    }
    if (filter === "pending") return !t.completed;
    return true;
  });

  const getAISuggestion = async (taskText) => {
    try {
      const res = await axios.get("https://taskflow-production-19a1.up.railway.app/getaisuggestions", {
        params: { task: taskText }
      });

      setAiSuggestion(res.data.suggestion);
    } catch (err) {
      console.log(err);
    }
  };

  const gettodaytask = async () => {
    if (!isloginuser) return;
    try {
      setLoading(true)
      const res =
        await axios.get(
          `${API_URL}/todaytask`,
          {
            params: {
              userid: isloginuser
            }
          }
        )

      setTodayTasks(
        res.data || []
      )

    }

    catch (err) {

      console.log(err)

    }

    finally {

      setLoading(false)

    }

  }
  // const todaytasks=gettodaytask()
  console.log("today tasks", todaytasks)

  localStorage.setItem("isloginuser", isloginuser)
  const completetasks = async (id, completed) => {
    const date = new Date()
    await axios.put(
      `${API_URL}completetask/${id}`,
      {
        completed: true,
        // completed: !completed,
        completedDate: date
      }
    );

    await displaytask();
  }

  const addTask = async () => {
    setLoading(true)
    const activegoal = JSON.parse(localStorage.getItem("activegoal"));
     if (!activegoal) {
      toast.error("Please select a goal First")
    // toast.warning("Please select a goal first");
    setLoading(false);
    return;
  }
    await axios.post(`${API_URL}addtask`, {
      task: task,
      time: time,
      priority: priority,
      userid: isloginuser,
      category: category,
      remainderenable: remainderenable,
      reminderTime: reminderTime,
      goalid: activegoal.id,
      repeat: recurring,
      repeatDays, repeatDate
    });
    toast.success("Task added successfully")

    console.log(recurring)
    setrecurring("")
    setTask("");
    settime("");
    // setuserid("")
    gettodaytask()
    setLoading(false)
  };



  const displaytask = async () => {
    const res = await axios.get(`${API_URL}displaytask?userid=${isloginuser}`)
    setTasks(res.data);
  }
 
  const deletetask = async (id) => {
    await axios.delete(`${API_URL}deletetask/${id}`);
    toast.success("Task deleted")
    gettodaytask()
  }

  const updateTask = async () => {
    await axios.put(`${API_URL}updatetask/${currentId}`, {
      task: editTask,
      time: editTime
    });
    toast.success("Task updated")
    setEditModal(false);
    gettodaytask()
  };

  // const islogin=false;  
  const setSearchf = async () => {
    const res = await axios.get(`${API_URL}searchtask?`, {
      params: {
        query: search,
        userid: isloginuser
      }
    })
    setsearch("")
    setTodayTasks(res.data)
    setTasks(res.data)
  }

  const signout = () => {
    localStorage.removeItem("islogin")
    localStorage.removeItem("isloginuser")
    setislogin(false)
    localStorage.removeItem("activegoal")
    // console.log("hey guys")
  }


  useEffect(() => {
    const login = localStorage.getItem("islogin");
    const userid = localStorage.getItem("userid");

    if (login === "true" && userid) {
      setislogin(true);
      setisloginuser(userid);
    }
  }, []);
  useEffect(() => {
    if (isloginuser) {
      // displaytask();
      gettodaytask();
    }
  }, [isloginuser]);
  if (islogin === false) {
    return <div><Auth setislogin={setislogin}
      setisloginuser={setisloginuser}
    /></div>
  }



  // const status=getTaskStatus(t)
  if (islogin === true) {


    // console.log("app",islogin);
    return (
      <div className={dark ? "app dark" : "app light"}>

        <div className='maindiv'>

          <Toaster />
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>

              <div className="modal" onClick={(e) => e.stopPropagation()}>

                <h2>Add New Task</h2>

                <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task"
                />

                <input
                  type='datetime-local'
                  value={time}
                  onChange={(e) => settime(e.target.value)}
                  placeholder="Enter time"
                />
                <select value={category}
                  onChange={(e) => { setcategory(e.target.value) }}
                >
                  <option >Study</option>
                  <option>Coding</option>
                  <option>Personal</option>
                  <option>Health</option>
                </select>
                <select

                  value={priority}
                  onChange={(e) => setpriority(e.target.value)}
                >
                  <option value={"High"}>High</option>
                  <option value={"Medium"}>Medium</option>
                  <option value={"Low"}>Low</option>
                </select>
                <p>Do you want to add timer ? </p>
                <select
                  value={String(remainderenable)}
                  onChange={(e) =>
                    setremainderenable(
                      e.target.value === "true"
                    )}
                >
                  <option value="false">
                    NO
                  </option>

                  <option value="true">
                    YES
                  </option>

                </select>
                <input
                  type="number"
                  placeholder="Minutes"
                  value={reminderTime}
                  onChange={(e) =>
                    setremainderTime(
                      Number(e.target.value)
                    )}
                />

                <select
                  className="recurring-task"
                  value={recurring}
                  onChange={(e) => setrecurring(e.target.value)}
                >
                  <option value={"none"}>none</option>
                  <option>daily</option>
                  <option>monthly</option>
                  <option>weekly</option>
                </select>


                {/* WEEKLY */}
                {recurring === "weekly" && (
                  <div className="repeat-days">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ].map(day => (
                      <label key={day}>
                        <input
                          type="checkbox"
                          value={day}
                          checked={repeatDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRepeatDays([...repeatDays, day]);
                            } else {
                              setRepeatDays(
                                repeatDays.filter(d => d !== day)
                              );
                            }
                          }}
                        />

                        {day}
                      </label>
                    ))}
                  </div>
                )}


                {/* MONTHLY */}
                {recurring === "monthly" && (
                  <select
                    value={repeatDate}
                    onChange={(e) => setRepeatDate(Number(e.target.value))}
                  >
                    <option value="">Select date</option>

                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                )}
                <button className='ripple-btn addtaskbtn'
                  onClick={() => {
                    addTask();
                    setShowModal(false);
                  }}
                >
                  {loading ? "Adding..." : "Add Task"}
                </button>
              </div>
            </div>
          )}
          <Sidebar tasks={tasks} setFilter={setFilter} setPage={setPage} setShowModal={setShowModal} signout={signout} dark={dark} setDark={setDark}
          />

          {page === "task" && (

            <div className='dashboard'>
              <div className='header'>
                <h2>Welcome back 👋
                  Manage your productivity today</h2>
              </div>

              <div className='searchtaskcard'>
                <h3>Search task</h3>
                <input type='text'
                  placeholder='Search task...'
                  value={search}
                  onChange={(e) => { setsearch(e.target.value) }} />

                <div className='searchtaskbtn'>

                  <button
                    onClick={() => { setSearchf() }}>Search</button>
                </div>
              </div>
              <ul>

                {editModal && (
                  <div className="modal-overlay" onClick={() => setEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                      <h2>Edit Task</h2>

                      <input
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                      />

                      <input
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                      />

                      <button onClick={updateTask}>
                        Update
                      </button>

                    </div>
                  </div>
                )}
                {/* <button onClick={displaytask}>displaytask</button> */}


                {filteredTasks.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#94A3B8", marginTop: "20px" }}>
                    No tasks yet. Add your first task 🚀
                  </p>
                ) :
                  filteredTasks.map((t) => {
                    const status = getTaskStatus(t)
                    return (
                      <li
                        key={t._id}>

                        <div className="taskcard">

                          <div className="left">

                            {getPriorityColor(t.priority)}

                            <input
                              className="checkbox"
                              checked={t.completed}
                              onChange={() => completetasks(t._id, t.completed)}
                              type="checkbox"
                            />

                            <div className="taskcontent">

                              <p className="tasktitle">
                                {t.task}
                              </p>

                              <div className="meta">

                                <span className="category">
                                  📁 {t.category || "General"}
                                </span>

                                <span className="tasktime">
                                  ⏰ {new Date(t.time).toLocaleTimeString("en-PK", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>

                              </div>

                            </div>

                          </div>

                          <div className="right">

                            <p className={`status ${status.toLowerCase()}`}>
                              {status}
                            </p>

                            <div className='taskbtns'> 
                            <button onClick={() => setDeleteTaskId(t._id)}>
  🗑️
</button>
                            <button onClick={() => getAISuggestion(t.task)}>✨</button> {aiSuggestion && (<div className="ai-box"> ✨ {aiSuggestion}</div>)} <button onClick={() => { setEditTask(t.task); setEditTime(t.time); setCurrentId(t._id); setEditModal(true); }}>✏</button> </div>
                          </div>

                        </div>
                      </li>)
                  })}
              </ul>

            </div>
          )}
{deleteTaskId && (
  <div className="delete-toast">
    <div>
      <strong>Delete this task?</strong>
      <p>This action cannot be undone.</p>
    </div>

    <div className="delete-actions">
      <button
        className="cancel-delete"
        onClick={() => setDeleteTaskId(null)}
      >
        Cancel
      </button>

      <button
        className="confirm-delete"
        onClick={() => {
          deletetask(deleteTaskId);
          setDeleteTaskId(null);
        }}
      >
        Delete
      </button>
    </div>
  </div>
)}
          {page === "analytics" && <Analytics tasks={tasks} todaytasks={todaytasks} time={time} isloginuser={isloginuser} setPage={setPage} />}
          {page === "goal" && <Goal isloginuser={isloginuser}></Goal>}
          {page === "Ai" && <Ai isloginuser={isloginuser} setPage={setPage}></Ai>}

        </div>
      </div>
    );
  }
}

export default App;