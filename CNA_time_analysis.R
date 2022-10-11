# load data 
curation_time<- read.csv(file = '~/Library/Mobile Documents/com~apple~CloudDocs/Ellen_Stuff/sema4/timeinput.csv')
#########################################################################
# 1. test of normality. R's default is the Shapiro-Wilk Test
#########################################################################
## if p-value > 0.05, we cannot reject the null hypothesis that the variable `len` is normally distributed,
## so we assume normality
sbs_time <- subset(curation_time, group=="sbs")
cnael_time <- subset(curation_time, group=="cnael")

shapiro.test(sbs_time$time) # note that in R, you can call a variable in a dataframe using `$`
shapiro.test(cnael_time$time) # note that in R, you can call a variable in a dataframe using `$`

#########################################################################
# 2. data is not normally distributed, use the wilcoxon rank-sum test
######################################################################### 

median(sbs_time$time)
quantile(sbs_time$time)
median(cnael_time$time)
quantile(cnael_time$time)

wilcox.test(time ~ group, data = curation_time,exact = FALSE,alternative = "two.sided") 

#########################################################################
# 3. Violin Plots to see how the data value distributed
#########################################################################
library(vioplot)
x1 <- sbs_time$time
x2 <- cnael_time$time
vioplot(x1, x2, names=c("sbs", "cnael"),
        col="gold")
title("Violin Plots: Mins of CNA Review")



