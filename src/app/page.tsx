"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  listenToQuests,
  listenToBagOfHolding,
  listenToGold,
  Quest,
  Item,
  Gold,
} from "../queries/firestoreQuery";
import BagOfHolding from "@/components/BagOfHolding";
import Quests from "@/components/Quests";
import GoldMenu from "@/components/Gold";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function Tracker() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [bag, setBag] = useState<Item[]>([]);
  const [gold, setGold] = useState<Gold[]>([]);
  const [inputPassword, setInputPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = process.env.PASSWORD; //I know this is dumb, but this is so no one can just up and use this shit and fuck it up

  useEffect(() => {
    const savedAuth = Cookies.get("tracker_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribeQuests = listenToQuests(setQuests);
      const unsubscribeBag = listenToBagOfHolding(setBag);
      const unsubscribeGold = listenToGold(setGold);
      Cookies.set("tracker_auth", "true", { expires: 30 }); 
      return () => {
        unsubscribeQuests();
        unsubscribeBag();
        unsubscribeGold();
      };
    }
  }, [isAuthenticated]);

  function compareStrings(a: string, b: string) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  const handleLogin = () => {
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
      Cookies.set("tracker_auth", "true", { expires: 30 }); 
    } else {
      alert("Incorrect password. Try again.");
      console.log(inputPassword)
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h2>Enter Password</h2>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Button onClick={handleLogin}>Submit</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Page Header */}
      <h1 className="text-center mb-4">The Knights of the Motif!</h1>
      <Row className="g-4">
        <Col md={4} className="p-3">
          <div className="p-3 border rounded shadow bg-light">
            <Quests quests={quests.sort(function(a, b){
              return compareStrings(a.title, b.title);
            })} />
          </div>
        </Col>
        <Col md={4} className="p-3">
          <div className="p-3 border rounded shadow bg-light">
            <BagOfHolding bag={bag.sort(function(a, b){
              return compareStrings(a.name, b.name);
            })} />
          </div>
        </Col>
        <Col md={4} className="p-3">
          <div className="p-3 border rounded shadow bg-light">
            <GoldMenu gold={gold} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
