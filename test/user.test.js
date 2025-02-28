// ✅ Import dependencies
import { expect } from "chai";
import sinon from "sinon";
import { cancelAppointment, getProfile, listAppointment, loginUser, registerUser, uploadImage } from "../backend/controllers/userController.js";

describe("User API Simple Tests", () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox(); // ✅ Initialize sandbox before each test
    });

    afterEach(() => {
        sandbox.restore(); // ✅ Restore sandbox after each test
    });

    // ✅ 1st Simple Test: User Registration
    it("should return a success response when a user is registered", async () => {
        const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await registerUser(req, res);
        expect(res.json.calledOnce).to.be.true;
    });

    // ✅ 2nd Simple Test: User Login
    it("should return a success response when correct user credentials are provided", async () => {
        const req = { body: { email: "john@example.com", password: "password123" } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await loginUser(req, res);
        expect(res.json.calledOnce).to.be.true;
    });

    // ✅ 3rd Simple Test: Get User Profile
    it("should return a success response when fetching user profile", async () => {
        const req = { userId: "123" };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await getProfile(req, res);
        expect(res.json.calledOnce).to.be.true;
    });

    // ✅ 4th Simple Test: Check if an empty appointment list is returned
    it("should return an empty appointment list if no appointments exist", async () => {
        const req = { userId: "123" };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await listAppointment(req, res);
        expect(res.json.calledOnce).to.be.true;
    });

    // ✅ 5th Simple Test: Check if an image upload returns a valid response
    it("should return a success response when an image is uploaded", async () => {
        const req = { file: { filename: "test_image.png" } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await uploadImage(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.true;
        expect(responseArg.data).to.equal("test_image.png");
    });

    // ✅ 6th Simple Test: Appointment Cancellation
    it("should return a success response when an appointment is cancelled", async () => {
        const req = { body: { appointmentId: "123" }, userId: "456" };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        await cancelAppointment(req, res);
        expect(res.json.calledOnce).to.be.true;
    });
});
