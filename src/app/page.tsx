"use client";

import { useEffect, useState } from "react";
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
import { Container, Row, Col } from "react-bootstrap";

export default function Tracker() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [bag, setBag] = useState<Item[]>([]);
  const [gold, setGold] = useState<Gold[]>([]);

  useEffect(() => {
    const unsubscribeQuests = listenToQuests(setQuests);
    const unsubscribeBag = listenToBagOfHolding(setBag);
    const unsubscribeGold = listenToGold(setGold);
    return () => {
      unsubscribeQuests();
      unsubscribeBag();
      unsubscribeGold();
    };
  }, []);

  function compareStrings(a: string, b: string) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
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
            <GoldMenu gold={gold.sort(function(a, b) {
              return compareStrings(Object.keys(a.personal_gold.players)[0], Object.keys(b.personal_gold.players)[0]);
            })} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
