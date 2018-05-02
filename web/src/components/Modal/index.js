import React from "react";
import ReactModal from "react-modal";
import "./Modal.css";

ReactModal.setAppElement("#root");

function Toggle({ openModal, children }) {
  return children(openModal);
}

function Body({ isOpen, closeModal, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      closeTimeoutMS={150}
    >
      {children({ isOpen, closeModal })}
    </ReactModal>
  );
}

export default class Modal extends React.Component {
  static Toggle = Toggle;
  static Body = Body;

  state = { modalIsOpen: false };

  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    const children = React.Children.map(this.props.children, child => {
      if (child.type === Toggle) {
        return React.cloneElement(child, { openModal: this.openModal });
      }

      if (child.type === Body) {
        return React.cloneElement(child, {
          isOpen: this.state.modalIsOpen,
          closeModal: this.closeModal
        });
      }

      return child;
    });

    return children;
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
}
