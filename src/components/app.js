import React from "react";
import Header from "./header";
import Typing from "./typing";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: true,
      difficulty: "easy",
    };
  }

  handleCallback = (childData) => {
    this.setState({ data: childData });
  };
  handlecallback = (childData) => {
    this.setState({ difficulty: childData });
    console.log(childData);
  };

  render() {
    return (
      <div>
        <Header
          parentCallback={this.handleCallback}
          parentcallback={this.handlecallback}
        />
        <Typing
          autorestart={this.state.data}
          difficulty={this.state.difficulty}
        />
      </div>
    );
  }
}

export default App;
