public with sharing class PropertyController {

    private static final Decimal DEFAULT_MAX_PRICE = 9999999;
    private static final Integer DEFAULT_PAGE_SIZE = 9;

    @AuraEnabled(cacheable=true)
    public static PagedResult getPagedPropertyList(
        String searchKey,
        Decimal maxPrice,
        Integer minBedrooms,
        Integer minBathrooms,
        Integer pageSize,
        Integer pageNumber
    ) {
        Decimal safeMaxPrice        = maxPrice != null ? maxPrice : DEFAULT_MAX_PRICE;
        Integer safeMinBedrooms     = minBedrooms != null ? minBedrooms : 0;
        Integer safeMinBathrooms    = minBathrooms != null ? minBathrooms : 0;
        Integer safePageSize        = pageSize != null ? pageSize : DEFAULT_PAGE_SIZE;
        Integer safePageNumber      = pageNumber != null ? pageNumber : 1;

        String searchPattern = '%' + searchKey + '%';
        Integer offSet = (safePageNumber - 1) * safePageSize;

        PagedResult result = new PagedResult();
        result.pageSize = safePageSize;
        result.pageNumber = safePageNumber;
        result.totalItemCount = Database.countQuery(PropertyController.getCountQueryString());
        result.records = Database.query(PropertyController.getRecordQueryString());
        return result;
    }

    private static String getCountQueryString() {
        return 
            'SELECT COUNT() FROM Property__c WHERE '
            + PropertyController.getQueryConditions();
    }

    private static String getRecordQueryString() {
        return 
            'SELECT '
            + PropertyController.getQueryFields()
            + ' FROM Property__c WHERE '
            + PropertyController.getQueryConditions()
            + ' '
            + PropertyController.getQueryDetails();
    }

    private static String getQueryFields() {
        return 
        'Id,Address__c,City__c,State__c,Description__c,Price__c,Baths__c,'
        + 'Beds__c,Thumbnail__c,Location__Latitude__s,Location__Longitude__s';
    }

    private static String getQueryConditions() {
        return 
            '(NAME LIKE :searchPattern '
            + 'OR City__c LIKE :searchPattern '
            + 'OR Tags__c LIKE :searchPattern) '
            + 'AND Price__c <= :safeMaxPrice '
            + 'AND Beds__c >= :safeMinBedrooms '
            + 'AND Baths__c >= :safeMinBathrooms';
    }

    private static String getQueryDetails() {
        return 
            'WITH SECURITY_ENFORCED '
            + 'ORDER BY Price__c '
            + 'LIMIT :safePageSize '
            + 'OFFSET :offSet';
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getPictures(Id propertyId) {
        List<ContentDocumentLink> links = [
            SELECT Id, LinkedEntityId, ContentDocumentId
            FROM ContentDocumentLink
            WHERE
                LinkedEntityId = :propertyId
                AND ContentDocument.FileType IN ('PNG', 'JPG', 'GIF')
            WITH SECURITY_ENFORCED
        ];

        if (links.isEmpty()) {
            return null;
        }

        Set<Id> contentIds = new Set<Id>();

        for (ContentDocumentLink link : links) {
            contentIds.add(link.ContentDocumentId);
        }

        return [
            SELECT Id, Title
            FROM ContentVersion
            WHERE ContentDocumentId IN :contentIds AND IsLatest = true
            WITH SECURITY_ENFORCED
            ORDER BY CreatedDate
        ];
    }
}