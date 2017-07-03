

function main() {

    var keywordIterator = AdWordsApp
        .keywords()
        .withCondition("CampaignName CONTAINS_IGNORE_CASE '#1 Costasol.EU SEARCH'")
        .forDateRange("20170501", "20170701")
        .get();

    Logger.log("TOTAL keywords selected: " + keywordIterator.totalNumEntities());

    while (keywordIterator.hasNext()) {

        var keyword = keywordIterator.next();

        if (keyword.isEnabled()) {
            var stats = keyword.getStatsFor("20170501", "20170701");
            var conversions = stats.getConversions();
            var position = stats.getAveragePosition();
            var text = keyword.getText();
            var firstPageCPC = keyword.getFirstPageCpc();
            // var adParams = keyword.adParams();
            var bidding = keyword.bidding();
            var labels = keyword.labels().get();

            while (labels.hasNext()) {
                var label = labels.next();
                keyword.removeLabel(label);
            }

            if (conversions > 0) {
                keyword.applyLabel("converter");

                if (position > 3.5) {
                    keyword.applyLabel("3.5+ position");
                }

                if (bidding.getCpc() < firstPageCPC && keyword.getQualityScore() >= 7) {
                    keyword.applyLabel("raise bid");
                    Logger.log("Keyword '" + text + "' needs a raise of " + String((firstPageCPC - bidding.getCpc()).toFixed(2)));
                } else if (bidding.getCpc() > firstPageCPC && position < 2) {
                    keyword.applyLabel("lower bid")
                    Logger.log("Keyword '" + text + "' bid can be lowered by " + String((firstPageCPC - bidding.getCpc()).toFixed(2)));
                }
            }

            if (text.indexOf("sale") > -1 || text.indexOf("buy") > -1 && position > 3.5) {
                keyword.applyLabel("3.5+ position");
            }
        }
    }
}