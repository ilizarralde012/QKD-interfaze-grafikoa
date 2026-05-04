package com.example.demo.entity_DL;

public enum SessionStatus {
    SLA_ASSIGNED_FOR_INIT("SLA assigned for init"),
    LEVEL_CONFIGURED_FOR_INIT("Level configured for init"),
    SLA_ASSIGNED_FOR_TARGET("SLA assigned for target"),
    LEVEL_CONFIGURED_FOR_TARGET("Level configured for target"),
    FAILED("Failed");
    
    private final String value;
    
    SessionStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    
    //Egiaztatu ea status honek xehetasunak erakutsi behar dituen.
    
    public static boolean shouldShowDetails(String status) {
        return LEVEL_CONFIGURED_FOR_INIT.value.equals(status) ||
               SLA_ASSIGNED_FOR_TARGET.value.equals(status) ||
               LEVEL_CONFIGURED_FOR_TARGET.value.equals(status);
    }
    
    
     // Egiaztatu ea status honek end_time erakutsi behar duen.
    
    public static boolean shouldShowEndTime(String status) {
        return LEVEL_CONFIGURED_FOR_TARGET.value.equals(status);
    }
    
    
    //String bat enum batera bihurtu.
     
    public static SessionStatus fromString(String value) {
        for (SessionStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        return null;
    }
}