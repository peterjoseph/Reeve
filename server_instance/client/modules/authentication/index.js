import React from "react";
import PropTypes from "prop-types";

import { Grid, Row, Col } from "react-bootstrap";

class Authentication extends React.Component {
  render() {
    return (
      <div id="authentication">
        <Grid fluid={true}>
          <Row>
            <Col xs={1} lg={5}>
              Left Column
            </Col>
            <Col xs={1} lg={7}>
              Right Column
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Authentication;
