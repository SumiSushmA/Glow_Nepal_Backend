import * as chai from "chai"; // ✅ Correct ES module import
import sinon from "sinon"; // ✅ Helps in mocking functions
import { addStylist, appointmentCancel, appointmentsAdmin, loginAdmin } from "../backend/controllers/adminController.js"; // ✅ Ensure correct path
import appointmentModel from "../backend/models/appointmentModel.js"; // ✅ Import the actual Mongoose model

const { expect } = chai;

describe("Admin API Tests", () => {
    let sandbox;  // ✅ Create a sandbox for stubbing

    beforeEach(() => {
        sandbox = sinon.createSandbox();  // ✅ Initialize sandbox before each test
    });

    afterEach(() => {
        sandbox.restore();  // ✅ Restore sandbox after each test
    });

    // ✅ Test 1: Successful Admin Login
    it("should return a success response when correct admin credentials are provided", async () => {
        const req = { body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } };
        const res = { json: sinon.spy() };

        await loginAdmin(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.true;
        expect(responseArg).to.have.property("token");
    });

    // ✅ Test 2: Failed Admin Login (Wrong Credentials)
    it("should return an error when incorrect admin credentials are provided", async () => {
        const req = { body: { email: "wrong@example.com", password: "wrongpassword" } };
        const res = { json: sinon.spy() };

        await loginAdmin(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Invalid credentials");
    });

    // ✅ Test 3: Fetch Appointments (Mocked Response)
    it("should return a success response with appointments", async () => {
        const req = {};
        const res = { json: sinon.spy() };
        const mockAppointments = [{ id: 1, date: "2025-03-01" }, { id: 2, date: "2025-03-02" }];

        // ✅ Correctly stub the Mongoose model method
        sandbox.stub(appointmentModel, "find").resolves(mockAppointments);

        await appointmentsAdmin(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.true;
        expect(responseArg.appointments).to.deep.equal(mockAppointments);
    });

    // ✅ Test 4: Cancel Appointment (Mocked Response)
    it("should return a success response when an appointment is cancelled", async () => {
        const req = { body: { appointmentId: "123456" } };
        const res = { json: sinon.spy() };

        // ✅ Correctly stub the Mongoose model method
        sandbox.stub(appointmentModel, "findByIdAndUpdate").resolves(true);

        await appointmentCancel(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.true;
        expect(responseArg.message).to.equal("Appointment Cancelled");
    });

    // ✅ Test 5: Add Stylist (Missing Data)
    it("should return an error when adding a stylist with missing details", async () => {
        const req = { body: { name: "", email: "", password: "", speciality: "" } };
        const res = { json: sinon.spy() };

        await addStylist(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Missing Details");
    });

    // ✅ Test 6: Add Stylist (Invalid Email)
    it("should return an error when adding a stylist with an invalid email", async () => {
        const req = { body: { name: "John Doe", email: "invalidemail", password: "StrongPass123", speciality: "Haircut", experience: "5", about: "Expert stylist", fees: "50", address: "{}" } };
        const res = { json: sinon.spy() };

        await addStylist(req, res);
        expect(res.json.calledOnce).to.be.true;
        const responseArg = res.json.getCall(0).args[0];

        expect(responseArg.success).to.be.false;
        expect(responseArg.message).to.equal("Please enter a valid email");
    });

});
