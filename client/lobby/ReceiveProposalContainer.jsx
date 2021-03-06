var React = require('react');
var {connect} = require('react-redux');
import { hashHistory } from 'react-router';

import ReceiveProposal from 'ReceiveProposal';
import {setActiveChannel} from 'activeChannelActions';
import {setDebate} from 'debateActions';

var ReceiveProposalContainer = React.createClass({

  componentDidMount: function() {
    const {socket, dispatch, user} = this.props;
    var thisRef = this;
    socket.on('invite to channel', ({id, resolution, challengee, sides}) => {
      dispatch(setActiveChannel({id, resolution, isDebate: true}));
      dispatch(setDebate({ sides, user }));
      socket.removeListener('invite to channel');
      //must remove here, removing from usual compUnmount spot led to
      //'invite to channel' event not occurring
      hashHistory.push('/debate');
    });
  },

  handleSubmit: function() {
    const {socket, challenger} = this.props;
    socket.emit('accept challenge', challenger);
  },

  handleReject: function() {
    const {socket, challenger, onClose} = this.props;
    socket.emit("reject challenge", challenger);
    onClose();
  },

  render: function() {
    const {challenger, resolution, sides, onClose} = this.props;
    var isChallengerPro = (sides.pro._id===challenger._id) ? true : false;
    return (<ReceiveProposal onSubmit={this.handleSubmit} onReject={this.handleReject}
                      challenger={challenger} resolution={resolution}
                      isChallengerPro={isChallengerPro} />);
  }
});

export default connect((state)=>{
  return {
    user: state.user
  };
})(ReceiveProposalContainer);
