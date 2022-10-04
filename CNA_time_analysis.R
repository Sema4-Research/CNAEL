# load data 
curation_time<- read.csv(file = '~/Library/Mobile Documents/com~apple~CloudDocs/Ellen_Stuff/sema4/timeinput.csv')
#########################################################################
# 1. test of normality. R's default is the Shapiro-Wilk Test
#########################################################################

## if p-value > 0.05, we cannot reject the null hypothesis that the variable `len` is normally distributed,
## so we assume normality
ori_time <- subset(curation_time, group=="ori")
cnael_time <- subset(curation_time, group=="cnael")

shapiro.test(ori_time$time) # note that in R, you can call a variable in a dataframe using `$`
shapiro.test(cnael_time$time) # note that in R, you can call a variable in a dataframe using `$`

#########################################################################
# 2. test of equal variance to see which t-test is more appropriate to use
#########################################################################

## if p-value > 0.05, we cannot reject the null hypothesis that the variable `len` has equal variance
var.test(time ~ group, data =curation_time , 
         alternative = "two.sided")
# With normality and equal variance assumptions met, we can use the classic t-test
#########################################################################
# 3. two-sample t-test (observations are not paired).
#########################################################################

## if the variance of the two groups are same, set var.equal = TRUE, and the classic t-test is used
t.test(ori_time$time, cnael_time$time, var.equal = TRUE)

# if the variance of the two groups are not equal, set var.equal = FALSE, then Welch's test is used 
t.test(ori_time$time, cnael_time$time, var.equal = FALSE)

# if data is not normally distributed, use the wilcoxon rank-sum test
wilcox.test(time ~ group, data = curation_time,exact = FALSE,alternative = "greater") 



