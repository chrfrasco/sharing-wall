import React from "react";
import ReactModal from "react-modal";
import "./Modal.css";

ReactModal.setAppElement("#root");

ReactModal.defaultStyles = {
  content: {
    ...ReactModal.defaultStyles.content,
    left: "50%",
    top: "50%",
    bottom: "unset",

    width: "calc(100% - 2rem)",
    maxWidth: "calc(880px - 2rem)",

    padding: "1rem",

    transform: "translateX(-50%) translateY(-50%)",

    border: "none",
    borderRadius: "none"
  },
  overlay: {
    ...ReactModal.defaultStyles.overlay,
    backgroundColor: "transparent"
  }
};

class Toggle extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { openModal, children } = this.props;
    return children(openModal);
  }
}

function Body({ isOpen, closeModal, children }) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
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
