package com.placamate.dto;

public class EligibilityResult {
    private boolean eligible;
    private String reason;

    public EligibilityResult(boolean eligible, String reason) {
        this.eligible = eligible;
        this.reason = reason;
    }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
