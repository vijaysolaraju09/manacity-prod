import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateWallet } from "../redux/slices/walletSlice";
import { fetchWalletDetails } from "../redux/actions/fetchWalletDetails";

function Wallet() {
  const dispatch = useDispatch();
  const walletDetails = useSelector((state) => state.wallet.wallet);
  const userMobileNumber = useSelector(
    (state) => state.user.userDetails?.mobileNumber
  );

  // States and handlers for "Add Money" modal
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState(0);

  const handleShowAddMoneyModal = () => setShowAddMoneyModal(true);
  const handleCloseAddMoneyModal = () => setShowAddMoneyModal(false);

  const handleAddMoney = async () => {
    try {
      const response = await fetch(
        "https://manacity-server.onrender.com/api/add-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: walletDetails.userId,
            amount: parseInt(addMoneyAmount), // Convert to number
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Dispatch an action to update the wallet balance in the Redux store
        dispatch(updateWallet(data.wallet));
      }

      // Close the modal
      handleCloseAddMoneyModal();
    } catch (error) {
      console.error("Error adding money:", error);
    }
  };

  // States and handlers for "Withdraw" modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const handleShowWithdrawModal = () => setShowWithdrawModal(true);
  const handleCloseWithdrawModal = () => setShowWithdrawModal(false);

  const handleWithdrawMoney = async () => {
    try {
      if (withdrawAmount <= 0) {
        // Don't proceed with withdrawal if the amount is not greater than 0
        return;
      }

      const response = await fetch(
        "https://manacity-server.onrender.com/api/withdraw-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: walletDetails?.userId,
            amount: parseInt(withdrawAmount),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Dispatch an action to update the wallet balance in the Redux store
        dispatch(updateWallet(data.wallet));
        // Redirect to WhatsApp chat with the specified number
        const whatsappNumber = "9063455042"; // Replace with the actual WhatsApp number
        const message = `Withdrawal of ${withdrawAmount} from my wallet`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");
      }

      // Close the modal
      handleCloseWithdrawModal();
    } catch (error) {
      console.error("Error withdrawing money:", error);
    }
  };

  console.log(walletDetails);

  useEffect(() => {
    // Fetch wallet details when the component mounts
    const fetchWallet = async () => {
      const updatedWallet = await fetchWalletDetails(userMobileNumber);
      dispatch(updateWallet(updatedWallet));
    };

    fetchWallet();
  }, [dispatch, userMobileNumber]);

  return (
    <>
      <div className="bg-dark mb-4">
        <div className="text-white px-3 py-5">
          <div className="mb-3 text-center">
            <h6 className="text-secondary mb-1">Available Balance </h6>
            <h2>
              <span className="font-12">Rs.</span>{" "}
              {walletDetails?.walletBalance}
            </h2>
          </div>
          <div className="d-flex justify-content-around">
            <Button
              onClick={handleShowAddMoneyModal}
              className="w-100 mx-1"
              disabled
            >
              Add Money
            </Button>
            <Button onClick={handleShowWithdrawModal} className="w-100 mx-1">
              Withdraw
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-top-4 ">
          <h3 className="text-secondary border-bottom font-16 p-3 mb-2 shadow">
            Transaction History
          </h3>
          <div className="">
            {walletDetails?.transactionHistory?.map((transaction) => (
              <div key={transaction._id} className="px-3 py-2 border-bottom ">
                <p className="text-secondary">
                  Transaction ID : {transaction.transactionId}
                </p>
                <div className="px-1">
                  <div className="d-flex justify-content-between">
                    {transaction.amountCredited > 0 && (
                      <>
                        <p className="">Credited with</p>
                        <p className="text-success">
                          + {transaction.amountCredited}
                        </p>
                      </>
                    )}
                    {transaction.amountDebited > 0 && (
                      <>
                        <p className="">Debited with</p>
                        <p className="text-danger">
                          - {transaction.amountDebited}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="">
                      <span className="fw-bold">Available :</span>{" "}
                      {transaction.balance}
                    </p>
                    <p>{transaction.timeOfTransaction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for adding money */}
      <Modal show={showAddMoneyModal} onHide={handleCloseAddMoneyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Money</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addMoneyAmount">
              <Form.Label>Enter Amount:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddMoneyModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => addMoneyAmount > 0 && handleAddMoney()}
          >
            Add Money
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for withdrawing money */}
      <Modal show={showWithdrawModal} onHide={handleCloseWithdrawModal}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Money</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="withdrawAmount">
              <Form.Label>Enter Amount:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWithdrawModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => withdrawAmount > 0 && handleWithdrawMoney()}
          >
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Wallet;
