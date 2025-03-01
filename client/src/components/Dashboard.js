import React, { useState, useEffect } from 'react'
import TransactionForm from './TransactionForm'
import TransactionDetail from './TransactionDetail'
import { Button, Container, Table, Col, Row } from 'react-bootstrap'
import DoughnutChart from './DoughnutChart'
import { transformDate } from './auth/helpers/tokenfunctions'

import { getCurrentUser } from './auth/helpers/tokenfunctions'


const Dashboard = () => {


  const [currentUser, setCurrentUser] = useState(null)

  const [displayMonth, setDisplayMonth] = useState(null)
  const [displayYear, setDisplayYear] = useState(null)

  const [monthlyTransactions, setMonthlyTransaction] = useState(null)
  const [monthlyOutgoingTransactions, setMonthlyOutgoingTransaction] = useState(null)
  const [monthlyIncomingTransactions, setMonthlyIncomingTransaction] = useState(null)
  const [monthlyIncomingSum, setMonthlyIncomingSum] = useState(null)
  const [monthlyOutgoingSum, setMonthlyOutgoingSum] = useState(null)

  const [showTransactionDetail, setShowTransactionDetail] = useState(false)
  const [transactionId, setTransactionId] = useState(null)
  const [rerenderToggle, setRerenderToggle] = useState(false)


  const monthsStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


  useEffect(() => {

    const currentDate = new Date()

    const currentMonth = currentDate.getMonth()

    const getCurrentUserData = async () => {
      const currentUserData = await getCurrentUser()

      setCurrentUser(currentUserData)
    }
    getCurrentUserData()
    setDisplayMonth(currentMonth)
    setDisplayYear(currentDate.getFullYear())

  }, [rerenderToggle])



  useEffect(() => {
    const getMonthlyTransactions = () => {


      const filteredMonthTransactions = currentUser.transactions.filter(item => {
        return transformDate(item.transaction_date).getMonth() === displayMonth && transformDate(item.transaction_date).getFullYear() === displayYear
      })

      filteredMonthTransactions.sort((a, b) => (transformDate(b.transaction_date).getDate()) - transformDate(a.transaction_date).getDate())


      const outgoingTransactions = []
      const incomingTransactions = []

      filteredMonthTransactions.map(item => {
        if (item.transaction_type === 'Outgoing') {
          outgoingTransactions.push(item)
        } else {
          incomingTransactions.push(item)
        }
      })

      setMonthlyTransaction(filteredMonthTransactions)
      setMonthlyOutgoingTransaction(outgoingTransactions)
      setMonthlyIncomingTransaction(incomingTransactions)

    }

    currentUser && getMonthlyTransactions()

  
  }, [currentUser, displayMonth, displayYear])



  const getTotals = (variableToMap) => {
    const sum = variableToMap.reduce((acc, item) => {
      return acc + item.amount
    }, 0)
    return sum
  }


  useEffect(() => {

    if (monthlyTransactions) {
      setMonthlyOutgoingSum(getTotals(monthlyOutgoingTransactions))
      setMonthlyIncomingSum(getTotals(monthlyIncomingTransactions))
    }

  }, [monthlyTransactions, monthlyOutgoingTransactions, monthlyIncomingTransactions])


  const toggleLeft = () => {
    if (displayMonth > 0) {
      setDisplayMonth(displayMonth - 1)
    } else {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    }

  }


  const toggleRight = () => {
    if (displayMonth < 11) {
      setDisplayMonth(displayMonth + 1)
    } else {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    }
  }



  const tableRowFill = (index) => {
    if (index % 2 === 0) {
      return 'fill'
    }
  }


  const displayBalance = () => {
    if (monthlyIncomingSum - monthlyOutgoingSum <= 0) {
      return `- £${Math.abs(monthlyIncomingSum - monthlyOutgoingSum).toFixed(2)}`
    } else {
      return `£${(monthlyIncomingSum - monthlyOutgoingSum).toFixed(2)}`
    }
  }


  const checkClick = (event) => {
    const idAsString = event.target.outerHTML.toString().replace('<td value="', '').split('"')[0]
    const idAsInt = parseInt(idAsString)
    setTransactionId(idAsInt)
    handleShow()
  }

  const handleClose = () => setShowTransactionDetail(false)
  const handleShow = () => setShowTransactionDetail(true)


  const rerender = () => {
    setRerenderToggle(!rerenderToggle)
  }


  if (!monthlyTransactions) return null

  return (

    <>

      {currentUser &&
        <>

          <Container>

            <Row className="dashbaordContainerRow">

              <Col md={12} lg={6}>

                <div className="dashboardTableContainer">
                  <Container className="tableBackground">
                    <Row className="dashboardHeaderRow">
                      <Col className="addTransactionButtonCol"></Col>
                      <Col xs={9} className="dashboardHeading">

                        <h2>Monthly Balance</h2>

                        <h2>{displayBalance()}</h2>
                      </Col>

                      <Col className="addTransactionButtonCol">
                        <TransactionForm
                          // {...currentUser} 
                          rerender={rerender}
                        />
                      </Col>
                    </Row>

                    <Container className="monthYearToggle">
                      {/* <Row> */}
                      <Button
                        variant="secondary"
                        className="togglButton leftButton"
                        onClick={toggleLeft}>
                        <i className="fas fa-caret-left fa-2x"></i>
                      </Button>

                      <div className="monthYear">


                        <h2>{monthsStr[displayMonth]} {displayYear}</h2>

                      </div>

                      <Button
                        variant="secondary"
                        className="togglButton rightButton"
                        onClick={toggleRight}>
                        <i className="fas fa-caret-right fa-2x"></i>
                      </Button>
                      {/* </Row> */}
                    </Container>


                    <Table bordered responsive hover>

                      <thead>
                        <tr>
                          {/* <th></th> */}
                          <th md="auto">Date</th>
                          <th md="auto">Amount</th>
                          <th md="auto">From/To</th>
                          <th md="auto">In/Out</th>
                          <th md="auto">Label</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyTransactions.length < 1 ? <tr>
                          <td colSpan={6}>No transaction yet.</td>
                        </tr>
                          :
                          monthlyTransactions.map((item, index) => {
                            return (

                              <tr key={index} className={tableRowFill(index)} onClick={checkClick}>

                                <td value={item.id}>{transformDate(item.transaction_date).getDate()}</td>


                                {item.transaction_type === 'Incoming' ?
                                  <td value={item.id} className="credit">£{item.amount}</td>
                                  :
                                  <td value={item.id} className>-£{item.amount}</td>
                                }

                                <td value={item.id}>{item.recipient_sender}</td>
                                <td value={item.id}>{item.transaction_type}</td>
                                <td value={item.id}>{item.label}</td>

                              </tr>

                            )
                          })

                        }
                      </tbody>
                    </Table>

                  </Container>
                </div>
              </Col>

              <Col md={12} lg={6}>

                <Container className="doughnutContainer">

                  <h2>Spending Breakdown</h2>

                  <DoughnutChart
                    transactions={monthlyTransactions}
                    outgoingTransactionsProps={monthlyOutgoingTransactions} />


                </Container>

              </Col>
            </Row>
          </Container>
          {showTransactionDetail && <TransactionDetail
            handleClose={handleClose}
            showTransactionDetail={showTransactionDetail}
            transactionId={transactionId}
            rerender={rerender}
            rerenderToggle={rerenderToggle}
          />
          }

        </>
      }
    </>

  )
}
export default Dashboard