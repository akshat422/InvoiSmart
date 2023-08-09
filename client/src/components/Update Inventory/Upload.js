import React, { Component } from "react";

import FileBase64 from "react-file-base64";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";
import "./upload.css";
import axios from "axios";

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation: "",
      isLoading: "",
      files: "",
      Invoice: "",
      Amount: "",
      InvoiceDate: "",
      Vendor: "",
      Description: "",
    };
    console.log(this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(event) {
    event.preventDefault();
    // console.log("submit button is clicked");
    const reactData = { uid: this.state.uid, Invoice: this.state.Invoice, Amount: this.state.Amount, InvoiceDate: this.state.InvoiceDate,Vendor: this.state.Vendor, Description: this.state.Description};
    const url = "https://cnqgqau3wb.execute-api.us-west-1.amazonaws.com/items";
    let sendData = (url,reactData) => {
      axios.post(url, reactData)
      .then(res => console.log('Data send'))
      .catch(err => console.log(err.data))
    }
    sendData(url,reactData)
  }

  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    // const name = target.name;

    this.setState({ name: value });
  }

  async getFiles(files) {
    console.log(files);
    const UID = Math.round(1 + Math.random() * (1000000 - 1));
    var data = {
      fileExt: "png",
      imageID: UID,
      folder: UID,
      img: files[0].base64,
    };

    this.setState({ confirmation: "Processing..." });
    await fetch(
      "https://ckz97bvy8k.execute-api.us-west-1.amazonaws.com/Production",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
          Authorization: "test",
        },
        body: JSON.stringify(data),
      }
    );
    console.log(UID);
    let targetImage = UID + ".png";
    const response = await fetch(
      "https://ckz97bvy8k.execute-api.us-west-1.amazonaws.com/Production/ocr",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(targetImage),
      }
    );

    this.setState({ confirmation: "" });

    const OCRBody = await response.json();
    console.log("OCRBody", OCRBody);

    this.setState({ Amount: OCRBody.body[0] });
    this.setState({ Invoice: OCRBody.body[1] });
    this.setState({ InvoiceDate: OCRBody.body[2] });
  }
  render() {
    const processing = this.state.confirmation;
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <h3 className="text-danger">{processing}</h3>
              <h6>Upload Invoice </h6>
              <FormText color="muted">PNG,JPG</FormText>
            </FormGroup>

            <div className="form-group files color">
              <FileBase64
                multiple={true}
                onDone={this.getFiles.bind(this)}
              ></FileBase64>
            </div>
            <FormGroup>
              <Label>
                <h6>Invoice</h6>
                <Input
                  type="text"
                  name="Invoice"
                  id="Invoice"
                  required
                  defaultValue={this.state.Invoice}
                  onChange={this.handleChange}
                ></Input>
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Amount</h6>
                <Input
                  type="text"
                  name="Amount"
                  id="Amount"
                  required
                  defaultValue={this.state.Amount}
                  onChange={this.handleChange}
                ></Input>
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Date</h6>
                <Input
                  type="text"
                  name="InvoiceDate"
                  id="InvoiceDate"
                  required
                  defaultValue={this.state.InvoiceDate}
                  onChange={this.handleChange}
                ></Input>
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Vendor</h6>
                <Input
                  type="text"
                  name="Vendor"
                  id="Vendor"
                  // required
                  defaultValue={this.state.Vendor}
                  onChange={this.handleChange}
                ></Input>
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Description</h6>
                <Input
                  type="text"
                  name="Description"
                  id="Description"
                  // required
                  defaultValue={this.state.Description}
                  onChange={this.handleChange}
                ></Input>
              </Label>
            </FormGroup>
            <Button className="btn btn-lg btn-block btn-success" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Upload;
