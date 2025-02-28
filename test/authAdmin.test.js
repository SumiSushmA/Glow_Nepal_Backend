import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import authAdmin from "../backend/middleware/authAdmin.js";

describe("Admin Authentication Middleware Tests", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox(); // ✅ Initialize sandbox before each test
    });

    afterEach(() => {
        sandbox.restore(); // ✅ Restore sandbox after each test
    });

    // ✅ 1st Simple Test: Admin Auth with Valid Token
    it("should allow access when a valid admin token is provided", async () => {
        const req = { headers: { atoken: "valid_token" } };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        // ✅ Mock JWT verification
        sandbox.stub(jwt, "verify").returns(process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);

        await authAdmin(req, res, next);
        expect(next.calledOnce).to.be.true; // ✅ Expect next() to be called
    });

    // ✅ 2nd Simple Test: No Token Provided
    it("should return an error when no token is provided", async () => {
        const req = { headers: {} };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        await authAdmin(req, res, next);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Not Authorized. Please Login Again");
    });

    // ✅ 3rd Simple Test: Invalid Token
    it("should return an error when an invalid token is provided", async () => {
        const req = { headers: { atoken: "invalid_token" } };
        const res = { json: sinon.spy() };
        const next = sinon.spy();

        // ✅ Mock JWT verification failure
        sandbox.stub(jwt, "verify").throws(new Error("Invalid Token"));

        await authAdmin(req, res, next);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Invalid Token");
    });
});
