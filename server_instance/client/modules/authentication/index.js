import React from "react";
import PropTypes from "prop-types";

import { Grid, Row, Col } from "react-bootstrap";

import InputField from "../../common/components/inputs/InputField";

class Authentication extends React.Component {
  render() {
    return (
      <div id="authentication">
        <Grid fluid={true}>
          <Row>
            <Col xs={1} lg={5}>
              <div className="h-100 d-inline-block">
                <div className="d-flex justify-content-center">
                  <InputField />
                  <InputField />
                </div>
              </div>
            </Col>
            <Col xs={1} lg={7}>
              <div className="h-100 d-inline-block" />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Authentication;
