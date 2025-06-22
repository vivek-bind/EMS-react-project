import React, { Component } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

class LeaveApplicationHRForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FromDateData: props.editData["FromDate"].slice(0, 10),
      ToDateData: props.editData["ToDate"].slice(0, 10),
      ReasonforleaveData: props.editData["Reasonforleave"],
      nameData: `${props.editData["employee"][0]["FirstName"]} ${props.editData["employee"][0]["LastName"]}`,
      LeaveType: props.editData["Leavetype"],
      Status: props.editData["Status"]
    };
  }

  render() {
    return (
      <div>
        <h2 id="role-form-title">Edit Leave Application Of {this.state.nameData}</h2>

        <div id="role-form-outer-div">
          <Form id="form" onSubmit={e => this.props.onLeaveApplicationHREditUpdate(this.props.editData, e)}>
            
            {/* Leave Type */}
            <Form.Group as={Row}>
              <Form.Label column sm={2}>Leave Type</Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control as="select" required value={this.state.LeaveType} disabled>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                </Form.Control>
              </Col>
            </Form.Group>

            {/* From Date */}
            <Form.Group as={Row}>
              <Form.Label column sm={2}>From Date</Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control type="date" required disabled value={this.state.FromDateData} />
              </Col>
            </Form.Group>

            {/* To Date */}
            <Form.Group as={Row}>
              <Form.Label column sm={2}>To Date</Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control type="date" required disabled value={this.state.ToDateData} />
              </Col>
            </Form.Group>

            {/* Reason for Leave */}
            <Form.Group as={Row}>
              <Form.Label column sm={2}>Reason for Leave</Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control type="text" placeholder="Reason for leave" required disabled value={this.state.ReasonforleaveData} />
              </Col>
            </Form.Group>

            {/* Leave Status */}
            <Form.Group as={Row}>
              <Form.Label column sm={2}>Leave Status</Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control as="select" required value={this.state.Status} onChange={(e) => this.setState({ Status: e.target.value })}>
                  <option value="Pending" disabled>Pending</option>
                  <option value="2">Approve</option>
                  <option value="3">Reject</option>
                </Form.Control>
              </Col>
            </Form.Group>

            {/* Submit Button */}
            <Form.Group as={Row} id="form-submit-button">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">Update</Button>
              </Col>
            </Form.Group>

            {/* Cancel Button */}
            <Form.Group as={Row} id="form-cancel-button">
              <Col sm={{ span: 10, offset: 2 }} id="form-cancel-button-inner">
                <Button type="reset" onClick={this.props.onFormEditClose}>Cancel</Button>
              </Col>
            </Form.Group>

          </Form>
        </div>
      </div>
    );
  }
}

export default LeaveApplicationHRForm;
