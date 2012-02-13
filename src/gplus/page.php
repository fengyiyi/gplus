<?php if (!gplus_is_pjax()) { get_header();$options = gplus_get_options(); ?>
<div id="content">
<?php };?>


	<?php the_post(); ?>
	<section class="post-page"><!-- post div -->
		<h2 class="title"><?php the_title() ?></h2>
		<div class="entry">
			<?php the_content(); ?>
			<?php wp_link_pages( array( 'before' => '<div class="page_link"><strong>' . __( 'Pages:' , 'gplus') . '</strong>' , 'after' => '</div>' ) ); ?>
		</div><!-- END entry -->
	</section><!-- END post -->

	
	
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar() ?>
<?php get_footer() ?>
<?php };?>