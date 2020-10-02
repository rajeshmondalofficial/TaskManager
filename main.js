// Importing Components
const { List, Avatar, Empty, Input, Form, Button, TimePicker, Result } = antd;

const { TextArea } = Input;

// Installing Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

function ScreenReducer(screen=0,action) {
  switch(action.type) {
    case 'MY_TASK':
      screen=0
      return screen
      
    case 'ADD_TASK':
      screen=1
      return screen
      
    case 'EXPIRED_TASK':
      screen=2
      return screen
      
    case 'REFRESH':
      return screen
      
    default:
      return screen
  }
}

function TaskReducer(task=[], action) {
  switch(action.type) {
    case 'ADD':
      task.push(action.data)
      localStorage.setItem('task',JSON.stringify(task))
      return task
    
    case 'REMOVE':
      task.splice(action.index,1)
      localStorage.setItem('task',JSON.stringify(task))
      return task
      
    case 'EDIT':
      return task
      
    case 'REMOVE_ALL':
      task = []
      return task
      
    default:
      return task
  }
}

let Reducer = Redux.combineReducers({
  Screen: ScreenReducer, 
  Tasks: TaskReducer
})

let store = Redux.createStore(Reducer)

var MyTasks = JSON.parse(localStorage.getItem('task'))

MyTasks?MyTasks.forEach((item)=>{
  store.dispatch({
    type: 'ADD',
    data: item
  })
}):console.log("New User")

function MyTask() {
  
  const [mytask, setMytask] = React.useState(null)
  const [load, setLoad] = React.useState(true)
  
  store.subscribe(()=>{
    let ActiveTask = []
    store.getState().Tasks.forEach((item) => {
      if (item.schedule > new Date().getTime()) {
        ActiveTask.push(item)
      }
    })
    if(ActiveTask.length>0) {
      setMytask(ActiveTask)
      setLoad(false)
    } else {
      setMytask(null)
    }
  })
  
  React.useEffect(()=>{
    let ActiveTask = []
    store.getState().Tasks.forEach((item)=>{
      if(item.schedule > new Date().getTime()) {
        ActiveTask.push(item)
      }
    })
    if (ActiveTask.length > 0) {
      setMytask(ActiveTask)
      setLoad(false)
    }
  }, [])
  
  const ListDescription = ({ description, schedule })=>{
    return(
      <div className="col-2-1">
        <div>{description}</div>
        <div>{(new Date(schedule).getDay()-new Date().getDay())==0?('Today'+'\n\b'+new Date(schedule).getHours()+'.'+new Date(schedule).getMinutes()):(new Date(schedule).getDay()-new Date().getDay()==1?('Tomorrow'+'\n\b'+new Date(schedule).getHours()+'.'+new Date(schedule).getMinutes()):(new Date(schedule).getDate()+"/"+(new Date(schedule).getMonth()+1)+"\n\b\n\b"+new Date(schedule).getHours()+"."+new Date(schedule).getMinutes(schedule)
        ) )}</div>
      </div>
    )
  }
  
  return(
    <div className="container">
      {mytask?<List
        itemLayout="horizontal"
        loading={load}
        dataSource={mytask}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={item.title} description={<ListDescription description={item.description} schedule={item.schedule} />}/> </List.Item>)} />:<Empty description="Great! You Done All" />}
      </div>
  )
}

function AddTask() {
  
  const onFinish = (values) => {
    let NewTask = {
     ...values,
     schedule: new Date(values.schedule).getTime()
    }
    store.dispatch({
      type: 'ADD',
      data: NewTask
    })
    RegisterNotification(NewTask.title, NewTask.description,NewTask.schedule)
    setComplete(true)
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
  const [complete, setComplete] = React.useState(false)
  
  return(
    <div className="container">
      {complete?<Result
          status="success"
          title="Successfully Add Task"
          extra={[
            <Button className="no-margin" type="primary" onClick={()=>setComplete(false)}>
              Add Another
            </Button>,
          ]}
        />:<Form onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
        <Form.Item label="Task Title" name="title" rules={[
          {
            required: true,
            message: 'Enter Task Title',
          },
        ]}>
          <Input placeholder="Your Task Title" />
        </Form.Item>
        
        <Form.Item label="Task Description" name="description" rules={[
        {
          required: true, 
          message: 'Enter Task Description'
        },
        ]}>
          <TextArea rows={4} placeholder="Your Task Description" />
        </Form.Item>
        
        <Form.Item label="When" name="schedule" rules={[
        {
          required: true, 
          message: "Please Select Task Timing"
        }
        ]}>
         <Input type="datetime-local" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">Add Task</Button>
        </Form.Item>
      </Form>}
    </div>
  )
}

function ExpiredTask() {
  const [mytask, setMytask] = React.useState(null)
  const [load, setLoad] = React.useState(true)
  
  store.subscribe(() => {
    var ActiveTask = []
    store.getState().Tasks.forEach((item) => {
      if (item.schedule > new Date().getTime()) {
        ActiveTask.push(item)
      }
    })
    if (ActiveTask.length > 0) {
      setMytask(ActiveTask)
      setLoad(false)
    } else {
      setMytask(null)
    }
  })
  
  React.useEffect(() => {
    let ActiveTask = []
    store.getState().Tasks.forEach((item) => {
      if (item.schedule < new Date().getTime()) {
        ActiveTask.push(item)
      }
    })
    if (ActiveTask.length > 0) {
      setMytask(ActiveTask)
      setLoad(false)
    }
  }, [])
  
  const ListDescription = ({ description, schedule })=>{
    return(
      <div className="col-2-1">
        <div>{description}</div>
        <div>{(new Date(schedule).getDay()-new Date().getDay())==0?('Today'+'\n\b'+new Date(schedule).getHours()+'.'+new Date(schedule).getMinutes()):(new Date(schedule).getDay()-new Date().getDay()==1?('Tomorrow'+'\n\b'+new Date(schedule).getHours()+'.'+new Date(schedule).getMinutes()):(new Date(schedule).getDate()+"/"+(new Date(schedule).getMonth()+1)+"\n\b\n\b"+new Date(schedule).getHours()+"."+new Date(schedule).getMinutes(schedule)
        ) )}</div>
      </div>
    )
  }
  
  return (
    <div className="container">
        {mytask?<List
          itemLayout="horizontal"
          loading={load}
          dataSource={mytask}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta title={item.title} description={<ListDescription description={item.description} schedule={item.schedule} />}/> </List.Item>)} />:<Empty description="You Don't have any Expired Tasks" />}
    <br />
    <Button type="danger" onClick={()=>{localStorage.setItem('task',null)
      store.dispatch({ type: 'REMOVE_ALL' })
   }}>Remove All Tasks</Button>
   </div>
  )
}

function App() {
  
  const [Screen, setScreen ] = React.useState(store.getState().Screen)
  
  store.subscribe(()=>{
    setScreen(store.getState().Screen)
  })
  
  return(
    <div className="body">
      <div className="bottom-bar">
        <div onClick={()=>store.dispatch({ type: 'MY_TASK' })}><ion-icon name="list-outline"></ion-icon><p>My Task</p></div>
        
        <div onClick={()=>store.dispatch({ type: 'ADD_TASK' })}><ion-icon name="add-circle-outline"></ion-icon><p>Add Task</p></div>
        
        <div onClick={()=>store.dispatch({ type: 'EXPIRED_TASK' })}><ion-icon name="hourglass-outline"></ion-icon><p>Expired Task</p></div>
      </div>
      <div>
        {Screen==0?<MyTask />:Screen==1?<AddTask />:<ExpiredTask />}
      </div>
    </div>
  )
}


setInterval(()=>{
  store.dispatch({ type: 'REFRESH' })
},60000)

async function RegisterNotification(title, description, timestamp) {
  const reg = await navigator.serviceWorker.getRegistration();
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('you need to allow push notifications');
    } else {
      reg.showNotification(
        title,
        {
          tag: timestamp, // a unique ID
          body: description, // content of the push notification
          showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
          data: {
            url: window.location.href, // pass the current url to the notification
          },
        }
      );
    }
  });
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);