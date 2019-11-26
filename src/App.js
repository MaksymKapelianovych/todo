import React from 'react';
import './App.css';
import ReactDOM from "react-dom";

/*
Todo app structure

TodoApp
  - TodoHeader
  - TodoList
    - TodoListItem #1
    - TodoListItem #2
      ...
    - TodoListItem #N
  - TodoForm
*/
let todoItems = [];
todoItems.push({index: 0, value: "1", done: false});
todoItems.push({index: 1, value: "2", done: false});
todoItems.push({index: 2, value: "3", done: false});
todoItems.push({index: 3, value: "4", done: false});

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.todoDone = this.todoDone.bind(this);
        this.state = {todoItems: todoItems};
    }

    addItem(todoItem) {
        todoItems.unshift({
            index: todoItems.length + 1,
            value: todoItem.newItemValue,
            done: false
        });
        this.setState({todoItems: todoItems});
    }

    removeItem(itemIndex) {
        todoItems.splice(itemIndex, 1);
        this.setState({todoItems: todoItems});
    }

    todoDone(itemIndex) {
        todoItems[itemIndex].done=!todoItems[itemIndex].done;
        this.setState({todoItems: todoItems});
    }

    render() {
        return (
            <div id="main">
                <TodoHeader/>
                <TodoList items={this.props.initItems} removeItem={this.removeItem} todoDone={this.todoDone}/>
                <TodoForm addItem={this.addItem} items={this.state.todoItems}/>
            </div>
        );
    }
}

class TodoListItem extends React.Component {
    constructor(props) {
        super(props);
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickDone = this.onClickDone.bind(this);
    }

    onClickClose() {
        let index = parseInt(this.props.index);
        this.props.removeItem(index);
    }

    onClickDone() {
        let index = parseInt(this.props.index);
        this.props.todoDone(index);
    }

    render() {
        let todoClass = this.props.item.done ?
            "done" : "undone";
        return (
            <li className="list-group-item " id={this.props.item.index}>
                <div className={todoClass}>
                    <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
                    {this.props.item.value}
                    <button type="button" className={todoClass === "done" ? "close" : "hidden"}
                            onClick={this.onClickClose}>&times;</button>
                </div>
            </li>
        );
    }
}

class TodoList extends React.Component {
    render() {
        let items = this.props.items.map((item, index) => {
            return (
                <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem}
                              todoDone={this.props.todoDone}/>
            );
        });
        return (
            <ul className="list-group"> {items} </ul>
        );
    }
}

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleOptionChanged = this.handleOptionChanged.bind(this);
        this.state = {selectedOption: 'all'};
    }

    componentDidMount() {
        this.refs.itemName.focus();
    }

    onSubmit(event) {
        event.preventDefault();
        let newItemValue = this.refs.itemName.value;

        if (newItemValue) {
            this.props.addItem({newItemValue});
            this.refs.form.reset();
        }
    }

    handleOptionChanged(event) {
        this.setState({selectedOption: event.target.value})
    }

    render() {
        let countActive = 0;
        this.props.items.forEach((e) => {
            if (!e.done) countActive++;
        });

        let list = document.getElementsByClassName("list-group");
        if (list.item(0) != null) {
            let items = list.item(0).childNodes;
            items.forEach(e => {
                e.className = 'list-group-item '
            });
        }
        if (this.state.selectedOption === 'active') {
            this.props.items.forEach((e) => {
                if (e.done) {
                  document.getElementById(e.index).className = "hidden";
                }
            });
        } else if (this.state.selectedOption === 'completed') {
            this.props.items.forEach((e) => {
                if (!e.done) {
                  document.getElementById(e.index).className = "hidden";
                }
            });
        }
        return (
            <div>
                <form ref="form" onSubmit={this.onSubmit} className="form-inline">
                    <input type="text" ref="itemName" className="form-control" placeholder="add a new todo..."/>
                    <button type="submit" className="btn btn-default">Add</button>
                </form>
                <label>{countActive} items left</label>
                <div className="radio">
                    <label>
                        <input type="radio" value="all" checked={this.state.selectedOption === 'all'}
                               onChange={this.handleOptionChanged}/>
                        All
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="active" checked={this.state.selectedOption === 'active'}
                               onChange={this.handleOptionChanged}/>
                        Active
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="completed"
                               checked={this.state.selectedOption === 'completed'}
                               onChange={this.handleOptionChanged}/>
                        Completed
                    </label>
                </div>
            </div>
        );
    }
}

class TodoHeader
    extends React
        .Component {
    render() {
        return <h1>Todo</h1>;
    }
}

ReactDOM.render(<TodoApp initItems={todoItems}/>, document.getElementById('root'));

export default TodoApp;
