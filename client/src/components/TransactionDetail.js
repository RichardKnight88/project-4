import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Modal, Card, ListGroup, ListGroupItem, Container, Row, Col, OverlayTrigger, Popover, Button } from 'react-bootstrap'
import { getIndividualTransaction, deleteTransaction, transformDate } from './auth/helpers/tokenfunctions'

const TransactionDetail = ({ handleClose, showTransactionDetail, transactionId }) => {

  const history = useHistory()

  const [transaction, setTransaction] = useState(null)
  const [deleteToast, setDeleteToast] = useState(false)


  console.log('ID', transactionId)
  console.log('TRANS DETAIL', showTransactionDetail)

  useEffect(() => {
    const accessTransaction = async () => {
      const transactionData = await getIndividualTransaction(transactionId)
      setTransaction(transactionData)
    }
    accessTransaction()
  }, [])

  transaction && console.log('ID', transaction)

  const showDeleteToast = () => setDeleteToast(true)
  const hideDeleteToast = () => setDeleteToast(false)

  const editTransaction = () => {
    console.log('CLICK')
    showDeleteToast()
  }

  const confirmDelete = () => {
    deleteTransaction(transaction.id)
    handleClose()
    history.push('/dashboard')
  }


  return (
    <>
      <Modal
        show={showTransactionDetail}
        onHide={handleClose}>

        {transaction &&
          <>
            <Container>
              <Card className="transactionCard">

                <Card.Header as="h5">

                  <Row>
                    <Col><strong>Transaction ID:</strong> {transaction.id}</Col>

                    <Col xs={2} sm={1}><i className="far fa-edit" onClick={editTransaction}></i></Col>

                    <OverlayTrigger
                      trigger="click"
                      onHide={() => console.log('HIDE')}
                      placement="left"
                      overlay={
                        <Popover className="deletePopover" id="popover-basic" >

                          <Popover.Header as="h3" className="deletePopoverHeader">Are you sure?</Popover.Header>

                          <Popover.Body className="deletePopover">
                            {/* <Button variant="outline-secondary">No</Button> */}
                            <Button 
                              variant="outline-danger"
                              onClick={confirmDelete}>Yes</Button>
                          </Popover.Body>

                        </Popover >}
                    >
                      <Col xs={2} sm={1}><i className="far fa-trash-alt" onClick={editTransaction}></i></Col>
                    </OverlayTrigger>
                  </Row>

                </Card.Header>

                <Card.Body>


                  <ListGroup className="list-group-flush">

                    {transaction.transaction_type &&
                      <ListGroupItem><strong>Transaction type:</strong> {transaction.transaction_type}</ListGroupItem>}

                    {transaction.amount &&
                      <ListGroupItem><strong>Amount:</strong> £{transaction.amount}</ListGroupItem>}

                    {transaction.recipient_sender &&
                      <ListGroupItem><strong>{transaction.transaction_type === 'Outgoing' ? 'Recipient' : 'Sender'}:</strong> {transaction.recipient_sender}</ListGroupItem>}

                    {transaction.label &&
                      <ListGroupItem><strong>Label:</strong> {transaction.label}</ListGroupItem>}

                    {transaction.description &&
                      <ListGroupItem><strong>Description:</strong> {transaction.description}</ListGroupItem>}

                    {transaction.transaction_date &&
                      <ListGroupItem><strong>Date:</strong> {transformDate(transaction.transaction_date).toDateString()}</ListGroupItem>}

                    {transaction.repeat &&
                      <ListGroupItem><strong>Repeats {transaction.repeat_frequency}</strong></ListGroupItem>}

                  </ListGroup>

                </Card.Body>
                <Card.Footer onClick={handleClose}>Done</Card.Footer>
              </Card>

            </Container>
          </>
        }

      </Modal>
    </>
  )
}

export default TransactionDetail