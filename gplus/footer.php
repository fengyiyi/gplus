</div>
<?php flush(); ?>
<footer>
	&copy; <?php echo date("Y"); ?>&nbsp;<?php bloginfo('name'); ?> - <a href="http://wordpress.org/">WordPress</a> - <a href="http://www.welefen.com/google-plus-for-wordpress-theme.html" title="plus theme designed by welefen">gplus</a>
</footer>
<?php wp_footer();?>
<?php if (!gplus_is_ie()):?>
<?php $options = get_option('gplus_options');?>
<div class="loading"><span>loading...</span></div>
<script>var pjaxHomeUrl = "<?php echo home_url();?>", pjaxTitleSuffix="<?php bloginfo('name'); ?>", pjaxUseStorage=<?php if ($options['not_use_storage']):?>false<?php else :?>true<?php endif;?>, pjaxCacheTime=<?php if (strlen($options['cache_time'])):echo intval($options['cache_time'])?><?php else :?>true<?php endif;?>, pjaxFx="<?php echo $options['show_fx']?>";</script>
<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/jquery.js"></script>
<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/plus.js"></script>
<?php if (trim($options['manifest_value'])):?>
<iframe src="<?php echo home_url(); ?>?manifest=welefen" style="display:none;"></iframe>
<?php endif;?>
<?php endif;?>
</body>
</html>