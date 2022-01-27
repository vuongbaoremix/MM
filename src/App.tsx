import { Button, Input, message, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import logo from './logo.svg';
import {DeleteOutlined} from  '@ant-design/icons';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    money: 1,
  },
  {
    key: '2',
    name: 'John',
    money: 2,
  },
];  

interface Column {
  name: string,
  money:number
}
interface State{
  data:Column[],
  modelAddNewVisible:boolean
}

class App extends React.Component<{}, State> {
  constructor(props:{}){
    super(props);

    this.state = {
      data: this.load(),
      modelAddNewVisible:false
    };
  }

    columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      with: 100
    },
    {
      title: <div style={{textAlign: "center"}}>Số tiền</div>,
      dataIndex: 'money',
      key: 'money',
      render: (val: any, rc:any, index:number) => {
        return <div style={{
          display: 'flex',
          justifyContent: "space-around"
        }}>
          <Button onClick={()=> this.decrement(index)} 
          type="primary" 
          danger
          >-</Button>
          <div style={{
            width: 100,
            textAlign: 'center',
            padding: "5px"
          }}
          >{val}</div>
          <Button onClick={()=> this.increment(index)} 
          type="primary" >+</Button>
        </div>
      },
      shouldCellUpdate: (record:Column, prevRecord:Column) => { 
        return record.money == prevRecord.money;
      }
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      render:(val: any, rc:any, index:number)=>{
        return <Button danger type="text" icon={<DeleteOutlined />} onClick={()=>{

          var obj = this.state.data[index];
          this.setState({
            data: this.state.data.filter(x=>x!==obj)
          }, this.save); 
        }}></Button>
      },
      width: 40
    }
  ];

  increment = (index:number)=>{ 
      var obj = this.state.data[index];
      obj.money++;
     
      this.setState({
        data: [...this.state.data]
      });

      this.save();
  }

  
  decrement = (index:number)=>{
    var obj = this.state.data[index];
    obj.money--; 
    
    this.setState({
      data: [...this.state.data]
    });

    this.save(); 
  }

  save = () =>{
    localStorage.setItem("data", JSON.stringify(this.state.data));
  }

  load = () =>{
    try{
    return JSON.parse(localStorage.getItem("data") ?? "[]");
    }
    catch{
      return []
    }
  }


  add = (name:string)=>{
    this.setState({
      modelAddNewVisible:false,
      data: [...this.state.data, {
        money: 0,
        name: name
      }]
   }, this.save);
  }

  render() { 

    let inputRef:Input|null = null;

    return <div className="App">
      <Table dataSource={this.state.data} columns={this.columns} pagination={false} />

      <Button 
      size="large"
      shape="circle"
      type="primary"
      style={{
        position: "fixed",
        right: 15,
        bottom: 15
      }}
      onClick={()=> this.setState({modelAddNewVisible:true})}
      >+</Button>
      <Modal visible={this.state.modelAddNewVisible}
        onOk={()=>{
          var name = inputRef?.state.value;

          if(!name){
            message.warn("Vui lòng nhập tên");
            return;
          } 
          
          this.add(name);

         inputRef?.setValue(""); 
        }}
        onCancel={() => this.setState({modelAddNewVisible:false})}
      >
        <div style={{
          marginBottom: 6
        }}>Tên:</div>
        <Input ref={ref=> inputRef = ref} allowClear></Input>
      </Modal>
    </div>
  }
}

export default App;
