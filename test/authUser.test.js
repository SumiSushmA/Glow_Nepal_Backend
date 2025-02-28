import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import authUser from "../backend/middleware/authUser.js";

describe("User Authentication Middleware Tests", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox(); // ✅ Set up sandbox for each test
    });

    afterEach(() => {
        sandbox.restore(); // ✅ Restore sandbox after each test
    });

    // ✅ 1st Test: Valid Token - Should allow access
    it("should allow access when a valid user token is provided", async () => {
        const req = { headers: { utoken: "valid_token" }, body: {} };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        // ✅ Mock JWT verification
        sandbox.stub(jwt, "verify").returns({ userId: "98765" });

        await authUser(req, res, next);
        expect(req.userId).to.equal("98765"); // ✅ Check if userId is assigned
        expect(next.calledOnce).to.be.true; // ✅ Expect next() to be called
    });

    // ✅ 2nd Test: No Token - Should return an error
    it("should return an error when no token is provided", async () => {
        const req = { headers: {} };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        await authUser(req, res, next);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Not Authorized. Please Login Again");
    });

    // ✅ 3rd Test: Invalid Token - Should return an error
    it("should return an error when an invalid token is provided", async () => {
        const req = { headers: { utoken: "invalid_token" } };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        // ✅ Mock JWT verification failure
        sandbox.stub(jwt, "verify").throws(new Error("Invalid Token"));

        await authUser(req, res, next);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Invalid Token");
    });
});
